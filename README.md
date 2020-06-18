# zv-keychain
Encrypt/decrypt passwords (or anything) then store/retrieve them from your local storage (via Command Line Interface).  
Makes use of node built-in **crypto** package.

#### Usage
1. Install dependency (*zv-load.env*)
```
cd <PATH TO zv-keychain>
npm install
```
2. Create .env file and specify path to keychain file (or any name preferred)
```
KEYCHAIN_PATH=<PATH TO THE FILE WHCH WILL SERVE AS KEYCHAIN>
```
> e.g. KEYCHAIN_PATH=/Users/teamzv/Documents/.keychain  
3. To encrypt, use **--encrypt** flag and provide **name** and (optional) **account** details
```
node app.js --encrypt <MNEMONIC_NAME> <PASSWORD_OR_ANY_TEXT> <OPTIONAL_DETAILS>
```
> e.g. node app.js --encrypt myNameGoogle myNameGooglePassword myName@google.com  
4. To decrypt, use **--decrypt** flag and provide **name** and the encrypted data, now decrypted, will be printed
```
node app.js --decrypt myNameGoogle
```
5. To show stored keys, use **--getNames** flag to print all *name* of all keys stored and an optional **name** argument to filter result to those containing that *name*
```
node app.js --getNames
```
6. With the **getNames** flag, an optional **name** argument may be used to filter result to those containing that *name*
```
node app.js --getNames myName
```

#### REMEMBER TO KEEP KEYCHAIN (FILE) SECURE & SAFE (!Important)
