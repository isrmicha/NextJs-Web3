import CameraIcon from "@mui/icons-material/Camera";
import ContentCutIcon from "@mui/icons-material/ContentCut";
import InsertLinkIcon from "@mui/icons-material/InsertLink";
import ReceiptIcon from "@mui/icons-material/Receipt";
import {
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import "./Task.css";
const loseMap = {
  rock: "paper",
  paper: "scissor",
  scissor: "rock",
};
const iconMap = {
  rock: <CameraIcon />,
  paper: <ReceiptIcon />,
  scissor: <ContentCutIcon />,
};
const TaskTable = ({ tasks }) => {
  return (
    <TableContainer component={Paper} className="task-table">
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Option</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Reward</TableCell>
            <TableCell>Tx</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tasks.map((task, index) => {
            return (
              <TableRow key={task.id}>
                <TableCell>#{task.id}</TableCell>
                <TableCell>
                  <Chip
                    icon={iconMap[task.input]}
                    label={task.input?.toUpperCase()}
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={`${task.winner ? "WIN" : "LOSE"} (${loseMap[
                      task.input
                    ]?.toUpperCase()})`}
                    color={task.winner ? "success" : "error"}
                    variant="filled"
                  />
                </TableCell>
                <TableCell>
                  {task.winner && (
                    <Chip
                      label={`+ ${task.reward} BNB`}
                      color={"success"}
                      variant="filled"
                    />
                  )}
                </TableCell>
                <TableCell>
                  {task.tx && (
                    <a
                      target="_blank"
                      href={`https://testnet.bscscan.com/tx/${task.tx}`}
                    >
                      <InsertLinkIcon />
                    </a>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TaskTable;
