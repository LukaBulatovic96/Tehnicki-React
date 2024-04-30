import axios from "axios";
import { UserAge } from './interface';

export async function loadApi(): Promise<number> {
  // Added inc=dob parameter to recieve only dob data
  return axios
  .get("https://randomuser.me/api/?results=10&inc=dob")
  .then((result) => {
    let total = 0;
    result.data.results.forEach((element: UserAge) => {
      total += element.dob.age;
    });
    return total / 10;
  }).catch((err) => {
    throw err; 
  });
}
