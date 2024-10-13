# SafeKey
A password manager for a EASV school project

## How To Run

1. Locate The Run.bat file at the root of the project
2. Run the batch file
3. Frontend will open op press register and save the secret
4. create a master password and press login
5. Congratz! you can now store your passwords safe with us!

## Security

### What Does SafeKey Protect Against?
Safekey is a way to keep your password safe for unwanted attention. Not only can it create strong passwords for your logins but it will keep it encrypted on your computer so if any where to snoop in and take a look they will not be able too. Even in the frontend has the passwords been censored soo anyone looking over your shoulder will not be able too see them. There is a copy button to copy the password for you.

### What Is SafeKeys Security Model?
SafeKey uses a AES as its encryption to all passwords in the program. When the user first open the program they can just type in a Master Password or Secret if they think they can do it more safe (not recomended). Or they can press register which will generete a secret for the user and ask them to save it somewhere. After they press login a AES key will be made by the Master Password and secret put together and then runned through a hasing algoritm (argon2) that will be the key for the AES and the secret again will be in the IV of the AES. This AES key will be saved as the user stays logged in to so the program can decrypt and encrypt the passwords as the user creates them. As soon the user logs out or closes the application (frontend part) it will make a call before closing to the backend to wipe the memory so it does not stay.
Connection between our backend and frontend has been made possible with named pipes a way of IPC (inter-process communication). we chose this way of comminication between our applications as it is very fast. its only intern application can commincate to it, soo no outside people can send request directly to it. We also used a option soo only 1 connection is allowed at a time for keeping listiners out another process will get an error for trying to connect to an pipe that is allready connected. Another option is only User created processes can comminicate to the pipes, so no system process or other processes can connect it has too be made by the user to acces theese pipes.

### How Is SafeKey Limited?
While SafeKey sounds great there is some short sights one is if the users pc is compromises there is a chance they could throw a user off a pipe and then connect to it again. While only 1 connection is allowed at a time and only processes created by the user can connect to it, does not apply to complete secure. If the users masterpassword is easy to guess as the programm does not require a minimum length for either the secret or master password. It will then be easier for the hacker to guess to come in the program. If the user enter wrong info it does not say to the user it was wrong but instead thinks it is a new user and comes with no passwords for the user as it cant decrypt them. One weaknens is the Decrypt pipe if the user is logged as it then can accept comminication and decrypt all passwords.

## Project Diagram
<div>
  <img src="https://github.com/user-attachments/assets/ea1de407-7cbb-461d-a9b8-172f0fd73d19" alt="billede">
</div>

## Project Visuals
 <div style="display: flex; flex-wrap: wrap; justify-content: space-between;">
  <img src="https://github.com/user-attachments/assets/784647dc-f748-4915-b54e-957653ea6fe1" alt="billede" style="width: 48%; margin: 1%;">
  <img src="https://github.com/user-attachments/assets/8ac309a4-2ce2-43d8-89fb-883a75067216" alt="billede" style="width: 48%; margin: 1%;">
  <img src="https://github.com/user-attachments/assets/fcc5c672-4412-476f-a4ed-7544a0fd8979" alt="billede" style="width: 48%; margin: 1%;">
  <img src="https://github.com/user-attachments/assets/84282574-4c26-409e-8fda-eaa22eb9db12" alt="billede" style="width: 48%; margin: 1%;">
</div>
