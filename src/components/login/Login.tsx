'use client';

import { type ChangeEvent } from 'react';

import { Logo } from '../common/Logo';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import LoginController from './LoginController';

const Login = () => {
  const { email, password, setEmail, setPassword, onSubmit, onRegister } =
    LoginController();

  return (
    <div className="height100 flex min-h-full flex-1 flex-col justify-center bg-slate-950 px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <form
          action="#"
          method="POST"
          className="space-y-6 rounded-md bg-white bg-opacity-10 p-10"
        >
          <div className="flex justify-center">
            <Logo />
          </div>

          <div>
            <div className="mt-2">
              <Input
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(val: ChangeEvent<HTMLInputElement>) =>
                  setEmail(val.target.value)
                }
                className="bg-white"
                required
              />
            </div>
          </div>

          <div>
            <div className="mt-2">
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(val: ChangeEvent<HTMLInputElement>) =>
                  setPassword(val.target.value)
                }
                placeholder="Contraseña"
                className="bg-white"
                required
              />
            </div>
          </div>

          <div className="flex space-x-3">
            <Button
              onClick={onSubmit}
              type="button"
              name="acceder"
              id="acceder"
              className="buttonFreeland flex w-full justify-center rounded-md border-2 border-freeland px-3 py-1.5 text-lg font-semibold leading-6 text-white shadow-sm hover:bg-freeland focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Acceder
            </Button>
            <Button
              onClick={onRegister}
              type="button"
              name="registro"
              id="registro"
              className="buttonFreeland flex w-full justify-center rounded-md border-2 border-freeland px-3 py-1.5 text-lg font-semibold leading-6 text-white shadow-sm hover:bg-freeland focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Registrarse
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export { Login };
