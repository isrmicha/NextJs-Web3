import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import "./Task.css";

const TaskTable = ({ tasks, onDelete }) => {
  return (
    <TableContainer component={Paper} className="task-table">
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Option</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tasks.map((task, index) => (
            <TableRow key={task.id}>
              <TableCell>{task.id.toString()}</TableCell>
              <TableCell>{task.input?.toUpperCase()}</TableCell>
              <TableCell>{task.status}</TableCell>
              {/* <TableCell>
                <DeleteIcon
                  fontSize="large"
                  style={{ opacity: 0.7, cursor: "pointer" }}
                  onClick={() => onDelete(index)}
                />
              </TableCell> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TaskTable;
