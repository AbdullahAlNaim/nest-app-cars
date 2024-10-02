import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UsersService } from "./users.service";
import { User } from "./users.entity";
import { BadRequestException } from '@nestjs/common';
// import exp from "constants";

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    // create fake copy of users service
    const fakeUsersService: Partial<UsersService> = {
      find: () => Promise.resolve([]),
      create: (email: string, password: string) =>
        Promise.resolve({ id: 1, email, password } as User)
    }

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          // if anyone asks for this "UsersService, then provide them with "FakeUsersService""
          // its saying provide -> thisServiceName theseValues -> useValues
          provide: UsersService,
          useValue: fakeUsersService
        }
      ]
    }).compile();

    service = module.get(AuthService);
  });


  it('can create an instance of auth service', async() => {
    expect(service).toBeDefined();
  })

  it('creates a new user with a salted  and hashed password', async() => {
    const user = await service.signup('asdf@example.com', 'asdf');

    expect(user.password).not.toEqual('asdf');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with email that is in use', async() => {
    fakeUsersService.find = () => Promise.resolve([{ id: 1, email: 'a', password: '1' } as User]);

    await expect(service.signup('asdf@example.com', 'asdf')).rejects.toThrow(
      BadRequestException,
    );
  }) 
})
