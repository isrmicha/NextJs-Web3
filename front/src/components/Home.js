"use client";
import { TaskContractAddress } from "@/config";
import {
  AppBar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  createTheme,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  ThemeProvider,
  Toolbar,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Web3 from "web3";
import TaskTable from "../components/Task";
import TaskAbi from "../utils/TaskContract.json";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#19d2a9",
    },
  },
});

export default function Home({ findMany, create }) {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("rock");
  const [isLoading, setIsLoading] = useState(false);
  const [balance, setBalance] = useState(0);
  const [currentAccount, setCurrentAccount] = useState("");
  const [correctNetwork, setCorrectNetwork] = useState(false);

  const getAllTasks = async () => {
    setIsLoading(true);
    findMany(currentAccount)
      .then((result) => {
        setTasks(result);
        setBalance(
          result.reduce((prev, curr) => {
            return (prev = prev + curr.reward);
          }, 0)
        );
      })
      .finally(() => setIsLoading(false));
  };

  const bootstrap = async () => {
    await connectWallet();
  };
  useEffect(() => {
    bootstrap();
  }, []);
  useEffect(() => {
    if (currentAccount) getAllTasks();
  }, [currentAccount]);

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        toast.error("Metamask not detected");
        return;
      }
      let chainId = await ethereum.request({ method: "eth_chainId" });
      console.log("Connected to chain:" + chainId);
      const bscChainId = "0x61";
      //   const sepoliaChainId = "0xaa36a7";
      // const localChainId = "0x7a69";

      if (chainId !== bscChainId) {
        alert("You are not connected to the BSC Testnet!");
        return;
      } else {
        setCorrectNetwork(true);
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log("Found account", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log("Error connecting to metamask", error);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const winner = Math.random() < 0.33;
    const task = {
      id: tasks.length + 1,
      input,
      winner,
    };

    try {
      const { ethereum } = window;

      if (ethereum) {
        const web3 = new Web3(ethereum);
        const TaskContract = new web3.eth.Contract(
          TaskAbi.abi,
          TaskContractAddress
        );
        const result = await TaskContract.methods
          .addTask(task.input, winner)
          .send({ from: currentAccount });
        const reward = Number(`0.000${(Math.random() * 100).toFixed(0)}`);
        await create({
          input: task.input,
          winner: task.winner,
          owner: currentAccount,
          reward: task.winner ? reward : 0,
          tx: result.transactionHash,
        });

        await getAllTasks();
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log("Error submitting new Task", error);
      toast.error("Error adding game");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <ThemeProvider theme={theme}>
      <div>
        <ToastContainer />
        <AppBar position="static">
          <Toolbar>
            <Typography
              variant="h6"
              component="div"
              sx={{
                flexGrow: 1,
                color: "white",
                letterSpacing: 0.1,
                fontWeight: "bold",
                textShadow: "1px 1px 1px rgba(0,0,0,0.5)",
              }}
            >
              Rock Paper Scissors
            </Typography>
            {currentAccount === "" ? (
              <Button color="inherit" onClick={connectWallet}>
                Connect Wallet
              </Button>
            ) : (
              <Typography variant="h6">
                <Chip
                  label={`Balance: ${balance.toFixed(6)} BNB`}
                  color={"success"}
                  variant="filled"
                />
                <Chip label={currentAccount} color={"info"} variant="filled" />
              </Typography>
            )}
          </Toolbar>
        </AppBar>
        <Container>
          {currentAccount === "" ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="100vh"
            >
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={connectWallet}
              >
                Connect Wallet
              </Button>
            </Box>
          ) : correctNetwork ? (
            <>
              {isLoading ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: 50,
                  }}
                >
                  <CircularProgress />
                </div>
              ) : (
                <Box mt={4}>
                  <Box
                    component="form"
                    onSubmit={addTask}
                    display="flex"
                    justifyContent="center"
                    mb={2}
                  >
                    <FormControl
                      variant="standard"
                      sx={{ m: 1, minWidth: 120 }}
                    >
                      <InputLabel id="demo-simple-select-standard-label">
                        Choose
                      </InputLabel>

                      <Select
                        labelId="demo-simple-select-standard-label"
                        id="demo-simple-select-standard-label"
                        value={input}
                        label="Choose"
                        onChange={(e) => setInput(e.target.value)}
                      >
                        <MenuItem value={"rock"}>Rock</MenuItem>
                        <MenuItem value={"paper"}>Paper</MenuItem>
                        <MenuItem value={"scissor"}>Scissor</MenuItem>
                      </Select>
                    </FormControl>

                    <Button variant="contained" color="primary" type="submit">
                      Play!
                    </Button>
                  </Box>
                  {!!tasks?.length && <TaskTable tasks={tasks} />}
                </Box>
              )}
            </>
          ) : (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              mt={4}
            >
              <Typography variant="h6" color="error">
                Please connect to the Sepolia Testnet
              </Typography>
              <Typography variant="subtitle1">and reload the page</Typography>
            </Box>
          )}
        </Container>
      </div>
    </ThemeProvider>
  );
}
