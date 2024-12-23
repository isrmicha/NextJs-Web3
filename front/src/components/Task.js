import CameraIcon from "@mui/icons-material/Camera";
import ContentCutIcon from "@mui/icons-material/ContentCut";
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
const TaskTable = ({ tasks, onDelete }) => {
  return (
    <TableContainer component={Paper} className="task-table">
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Option</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Reward</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tasks.map((task, index) => {
            const isWin = task.status === "WIN";
            return (
              <TableRow key={task.id}>
                <TableCell>#{task.id.toString()}</TableCell>
                <TableCell>
                  <Chip
                    icon={iconMap[task.input]}
                    label={task.input?.toUpperCase()}
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={`${task.status} (${loseMap[
                      task.input
                    ]?.toUpperCase()})`}
                    color={isWin ? "success" : "error"}
                    variant="filled"
                  />
                </TableCell>
                {isWin && (
                  <TableCell>
                    {" "}
                    <Chip
                      label={`+ 0.000${(Math.random() * 100).toFixed(0)} BNB`}
                      color={"success"}
                      variant="filled"
                    />
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TaskTable;
