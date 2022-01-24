const { readFile } = require('fs');
const express = require('express');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (request, response) => {
  return response.send(request.query.cpf);
})
app.get("/:cpf", (request, response) => {
  readFile('./blacklist.txt', (err, cpfs) => {
    try{
    if (err) res.status(422).send(err.message);
    const rgx = /\d+/g
    const sanitezedCpf = request.params.cpf.match(rgx).join('')
  
    const listedCpfs = cpfs.toString().split("\n");
    for(const cpf of listedCpfs) {
      if(sanitezedCpf === (cpf.match(rgx).join(''))){
        return response.status(401).send({ status: 'BLOCKED'});
      }
    }
    return response.status(200).send({ status: 'FREE'});
  } catch (err) {
      return response.status(400).send({ status: 'INVALID VALUE' });
  }
  });
});

app.listen(5000);
