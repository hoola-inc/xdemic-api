const { Credentials } = require('uport-credentials');
const serverCredentials = require('../constants/main.constant').credentials;
const didJWT = require('did-jwt').decodeJWT;

const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NkstUiJ9.eyJpYXQiOjE1NzEzMTE4NDQsImV4cCI6IjIwMjAtMTAtMTZUMTk6MDA6MDAuMDAwWiIsInN1YiI6ImRpZDpldGhyOjB4MzI0MTMxMTRhYjEwNzllMDgwOTkyZTEyYWEyNTkzYTE4MzYwOTliOCIsImNsYWltIjpbeyJpc3N1ZXIiOnsiaWQiOiJkaWQ6ZXRocjoweDMyNDEzMTE0YWIxMDc5ZTA4MDk5MmUxMmFhMjU5M2ExODM2MDk5YjgifSwibGV2ZWwiOnsidHlwZSI6eyJ0eXBlIjoiRGVmaW5lZFRlcm0iLCJuYW1lIjoiU0NRRiBMZXZlbCA3IiwiaW5EZWZpbmVkVGVybVNldCI6Imh0dHBzOi8vd3d3LnNxYS5vcmcudWsvc3FhLzcxMzc3Lmh0bWwifX0sInJlcXVpcmVtZW50Ijp7ImlkIjoiIiwidHlwZSI6IiIsIm5hcnJhdGl2ZSI6IiJ9LCJ0eXBlIjoiQWNoaWV2ZW1lbnQiLCJzcGVjaWFsaXphdGlvbiI6IkJhc2ljIFRlY2huaWNhbCBMaXRlcmFjeSIsInN0dWRlbnRESUQiOltdLCJfaWQiOiI1ZGE4NGY2ZmI5ZjU1ZDMwODBlZTA3ZTYiLCJuYW1lIjoiUEh5c2ljcyAxMjMiLCJhbGlnbm1lbnRzIjpbXSwicmVzdWx0RGVzY3JpcHRpb25zIjpbXSwidGFncyI6W10sImNyZWF0ZWRBdCI6IjIwMTktMTAtMTdUMTE6MjQ6MzEuNTQwWiIsInVwZGF0ZWRBdCI6IjIwMTktMTAtMTdUMTE6MjQ6MzEuNTQwWiIsIl9fdiI6MH1dLCJpc3MiOiJkaWQ6ZXRocjoweGQ3NDFhNmRkMjcxMTUyMWU4Nzk4ZmJlOTJjMTJmY2I5ZDJmNDNjZjEifQ.k3dh37YrImbZAkghOzp0PmMVAHNE8CX-fl3h5fIX0QXcZXdOorSpGcI8yXDSVrPE92y6KGOVIP5BirMxa8X_NQA";
console.log(JSON.stringify(didJWT(token)));
// didJWT.verifyJWT(token, {
//     audience: 'did:ethr:0xfc25e43135508354a6d0bbc73b3003b60c37f8fa'
// })
// .then(res => {
//     console.log('Response ::: ', res);
//     console.log('JWT Decoder ::: ', didJWT.decodeJWT(res.jwt));
// })

// console.log(Math.floor(new Date().getTime() / 1000) + 30 * 24 * 60 * 60);
