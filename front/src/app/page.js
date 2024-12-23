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
        console.log(allTasks);
        allTasks = allTasks.map((task) => ({
          id: task.id.toString(),
          taskText: task.taskText,
          wallet: task.wallet,
          taskDate: new Date(task.taskDate * 1000).toLocaleDateString(),
          taskTime: new Date(task.taskDate * 1000).toLocaleTimeString(),
          isDeleted: task.isDeleted,
        }));
        setTasks(allTasks);
      } else {
        console.log("Ethereum object doesn't exist");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllTasks();
  }, []);
  const [testMap, setTestMap] = useState([]);
  const test = () => {
    setTestMap((test) => [
      ...test,
      {
        id: test.length + 1,
        input,
        status: Math.random() < 0.33 ? "WIN" : "LOSE",
      },
    ]);
  };
  const rmTest = (index) => {
    setTestMap((test) => test.filter((test, index2) => index !== index2));
  };
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
      toast.success("Wallet connected");
    } catch (error) {
      console.log("Error connecting to metamask", error);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();

    const task = {
      id: tasks.length + 1,
      taskText: input,
      isDeleted: false,
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
          .addTask(task.taskText, task.isDeleted)
          .send({ from: currentAccount });
        setTasks([...tasks, task]);
        setInput("");
        toast.success("Task added");
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log("Error submitting new Task", error);
      toast.error("Error adding task");
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const web3 = new Web3(ethereum);
        const TaskContract = new web3.eth.Contract(
          TaskAbi.abi,
          TaskContractAddress
        );

        await TaskContract.methods
          .deleteTask(taskId, true)
          .send({ from: currentAccount });

        // Mettre à jour la liste des tâches localement
        const updatedTasks = tasks.map((task) =>
          task.id === taskId.toString() ? { ...task, isDeleted: true } : task
        );

        setTasks(updatedTasks);
        toast.success("Task deleted");
      } else {
        console.log("Ethereum object doesn't exist");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error deleting task");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <div>
        <ToastContainer />
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" style={{ flexGrow: 1 }}>
              rock-paper-scissors
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
              <Typography variant="h4" align="center" gutterBottom>
                {" "}
                rock-paper-scissors{" "}
              </Typography>
              <Box
                component="form"
                // onSubmit={addTask}
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

                <Button variant="contained" color="primary" onClick={test}>
                  Play Demo!
                </Button>
                {/* <Button variant="contained" color="primary" type="submit">
                Play!
              </Button> */}
              </Box>
              {!!testMap?.length && (
                <TaskTable tasks={testMap} onDelete={rmTest} />
              )}
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
