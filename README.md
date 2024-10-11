# SafeKey
A password manager for a EASV school project

## How To Run

1. Locate The Run.bat file at the root of the project
2. Run the batch file
3. Congratz! you can now store your passwords safe with us!

## Security

### What Does SafeKey Protect Against?
SafeKey is a robust password manager designed to securely store your logins and passwords locally on your device. By doing so, it offers protection against a variety of threats, including potential malware and malicious actors who may have gained access to your device. SafeKey ensures that your sensitive information is not stored in plain text, reducing the risk of unauthorized access. This local storage approach also minimizes the exposure of your data to external servers, further enhancing your security.

### What Is SafeKeys Security Model?
SafeKey utilizes a multi-layered security model to protect your data. First, it employs the Argon2 hashing algorithm to create a secure, hashed encryption key from your login credentials. This key is then used to encrypt your logins and passwords using AES encryption, ensuring that your data is stored securely. Your SafeKey login serves as your unique key to decrypt your stored information, adding an additional layer of security. This model ensures that even if an unauthorized party gains access to your device, they will not be able to decrypt your data without your login credentials.

### How Is SafeKey Limited?
While SafeKey offers robust security features, it also has some inherent limitations. Since your SafeKey login is the encryption key, it is crucial to remember it. If you lose or forget your login credentials, there is no way to recover your encryption key, and you will lose access to your stored logins and passwords. To ensure maximum security, SafeKey does not keep any persistent record of the encryption key. Your encryption key is only stored in memory while SafeKey is logged in, and it is immediately wiped from memory upon closing the program. This approach ensures that your data remains secure, but it also means that you must take responsibility for remembering your login credentials. another shortfall is that you the user has to come up with the Masterpassword and Secret for the encryption there is no minimum length so it can be from 1 char to how many you wish your secret and master password should be.

## Project Diagram
<div>
  <img src="https://github.com/user-attachments/assets/ea1de407-7cbb-461d-a9b8-172f0fd73d19" alt="billede">
</div>

## Project Visuals
 <div style="display: flex; flex-wrap: wrap; justify-content: space-between;">
  <img src="https://github.com/user-attachments/assets/1d8fb6be-0a4e-423a-9f49-0e27a252acbd" alt="billede" style="width: 48%; margin: 1%;">
  <img src="https://github.com/user-attachments/assets/562dcb4a-1c3f-42de-9ef5-845ac4319735" alt="billede" style="width: 48%; margin: 1%;">
  <img src="https://github.com/user-attachments/assets/0665c33a-8362-462f-8661-2da78f818442" alt="billede" style="width: 48%; margin: 1%;">
  <img src="https://github.com/user-attachments/assets/c49dc2b3-76c2-43da-9b10-df358c7fc57f" alt="billede" style="width: 48%; margin: 1%;">
</div>
