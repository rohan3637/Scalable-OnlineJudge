import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Box,
  TableContainer,
  TableHead,
  TableRow,
  TableCell,
  Table,
  TableBody,
  TablePagination,
  Paper,
  Typography,
} from "@mui/material";

const Questions = () => {
  const [questions, setQuestions] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getQuestions = () => {
      axios
        .get(
          "http://localhost:5000/api/question/get_all_questions?id=64eb8c542fa828f023c816c8"
        )
        .then((response) => {
          if (response.status === 200) {
            console.log(response.data.questions);
            setQuestions(response.data.questions);
          } else {
            setError(response.data.message);
          }  
        })
        .catch((error) => {
          setError(error.response.data.message);
        });
    };

    getQuestions();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Container maxWidth="lg">
      <Box mt={5}>
        <Paper elevation={2}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{ padding: "12px", fontSize: "15px", fontWeight: "bold" }}>S.No</TableCell>
                  <TableCell style={{ padding: "12px", fontSize: "15px", fontWeight: "bold" }}>Title</TableCell>
                  <TableCell style={{ padding: "12px", fontSize: "15px", fontWeight: "bold" }}>Difficulty</TableCell>
                  <TableCell style={{ padding: "12px", fontSize: "15px", fontWeight: "bold" }}>Accuracy</TableCell>
                  <TableCell style={{ padding: "12px", fontSize: "15px", fontWeight: "bold" }}>Total Submissions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {questions
                  .slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                  .map((item, index) => (
                    <TableRow
                      key={item.sequence}
                      className={index % 2 === 0 ? "table-row-even" : "table-row-odd"} // Apply striped effect
                    >
                      <TableCell style={{ padding: "12px", fontSize: "14px" }}>{index + 1}</TableCell>
                      <TableCell style={{ padding: "12px", fontSize: "14px" }}>
                        <a type="button" href={`/question/${item.title}`}>
                          {item.title}
                        </a>
                      </TableCell>
                      <TableCell
                        style={{
                          color:
                            item.difficulty === "EASY"
                              ? "green"
                              : item.difficulty === "MEDIUM"
                              ? "#F49D1A"
                              : "red",
                          padding: "8px",
                          fontSize: "14px",
                        }}
                      >
                        {item.difficulty === "EASY"
                          ? "Easy"
                          : item.difficulty === "MEDIUM"
                          ? "Medium"
                          : "Hard"}
                      </TableCell>
                      <TableCell style={{ padding: "12px", fontSize: "14px" }}>
                        {(item.correctSubmission / item.totalSubmission || 0.0).toFixed(
                          2
                        )}
                        %
                      </TableCell>
                      <TableCell style={{ padding: "12px", fontSize: "14px" }}>{item.totalSubmission}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 20, 30]} // Options for records per page
            component="div"
            count={questions.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Box>
    </Container>
  );
};

export default Questions;


