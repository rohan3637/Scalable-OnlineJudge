import React, { useEffect, useState } from "react";
import axios from "axios";
//import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { Table, Container } from 'react-bootstrap';

const Questions = () => {
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getQuestions = () => {
      axios
        .get(
          "http://localhost:5000/api/question/get_all_questions?id=64eb8c542fa828f023c816c8"
        )
        .then((response) => {
          console.log(response.data.questions);
          setQuestions(response.data.questions);
        })
        .catch((error) => {
          console.log(error);
          setError(error.response.data.message); // Assuming the error message is provided in the response data
        });
    };

    getQuestions();
  }, []);

  return (
    <Container>
      <h2 className="text-black">Questions</h2>
      <hr />
      <Table striped bordered hover variant="dark">
        <thead>
          <tr>
            <th>S.No</th>
            <th>Title</th>
            <th>Difficulty</th>
            <th>Total Submission</th>
            <th>Correct Submission</th>
          </tr>
        </thead>
        <tbody>
          {questions?.map((item, index) => (
            <tr key={item.sequence}>
              <td>{index + 1}</td>
              <td>
                <a type="button" href={"/question/" + item?.title}>
                  {item?.title}
                </a>
              </td>
              <td
                style={{
                  color:
                    item.difficulty === 'EASY'
                      ? "green"
                      : item.difficulty === 'MEDIUM'
                      ? "#F49D1A"
                      : "red",
                }}
              >
                {item.difficulty === 'EASY'
                  ? "Easy"
                  : item.difficulty === 'MEDIUM'
                  ? "Medium"
                  : "Hard"}
              </td>
              <td>{item.totalSubmission}%</td>
              <td>{item.correctSubmission}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default Questions;
