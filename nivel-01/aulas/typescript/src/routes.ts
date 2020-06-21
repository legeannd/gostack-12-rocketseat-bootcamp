import { Request, Response } from 'express';
import createUser from './services/CreateUser';

export function helloWorld(request: Request, response: Response) {
  const user = createUser({
    email: 'gean.lfpsa@gmail.com',
    password: '02112',
    techs: [
      'Node JS', 
      'React JS', 
      'React Native',
      { title: 'JavaScript', experience: 100},
    ]
  });

  return response.json({ message: 'Hello World' });
}