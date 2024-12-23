"use client";
import {
  AppBar,
  Box,
  Button,
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
import { TaskContractAddress } from "../config";
import TaskAbi from "../utils/TaskContract.json";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#19d2a9",
    },
  },
});

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("rock");
  const [balance, setBalance] = useState(0);
  const [currentAccount, setCurrentAccount] = useState("");
  const [correctNetwork, setCorrectNetwork] = useState(false);

  const getAllTasks = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const web3 = new Web3(ethereum);
        const TaskContract = new web3.eth.Contract(
          TaskAbi.abi,
          TaskContractAddress
        );

        let allTasks = await TaskContract.methods.getMyTasks().call();
        allTasks = allTasks.map((task) => ({
          id: task.id,
          taskText: task.taskText,
          wallet: task.wallet,
          taskDate: new Date(task.taskDate * 1000).toLocaleDateString(),
          taskTime: new Date(task.taskDate * 1000).toLocaleTimeString(),
          winner: task.winner,
        }));
        console.log(allTasks);
        setTasks(allTasks);
      } else {
        console.log("Ethereum object doesn't exist");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    connectWallet();
    getAllTasks();
  }, []);
  const [taskMap, setTaskMap] = useState([]);

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        toast.error("Metamask not detected");
        return;
      }
      let chainId = await ethereum.request({ method: "eth_chainId" });
      console.log("Connected to chain:" + chainId);

      const sepoliaChainId = "0xaa36a7";

      if (chainId !== sepoliaChainId) {
        alert("You are not connected to the Sepolia Testnet!");
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
    const winner = Math.random() < 0.33;
    const task = {
      id: taskMap.length + 1,
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
        await TaskContract.methods
          .addTask(task.input, winner)
          .send({ from: currentAccount });
        setTaskMap((tasks) => [...tasks, task]);
        toast.success("Game added");
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log("Error submitting new Task", error);
      toast.error("Error adding task");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <div>
        <ToastContainer />
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" style={{ flexGrow: 1 }}>
              Rock-Paper-Scissors
            </Typography>
            {currentAccount === "" ? (
              <Button color="inherit" onClick={connectWallet}>
                Connect Wallet
              </Button>
            ) : (
              <Typography variant="h6">{currentAccount}</Typography>
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
            <Box mt={4}>
              <Box
                component="form"
                onSubmit={addTask}
                display="flex"
                justifyContent="center"
                mb={2}
              >
                <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
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
              {!!taskMap?.length && <TaskTable tasks={taskMap} />}
            </Box>
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
