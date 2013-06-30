Securli - a simple service to send encrypted messages
-----------------------------------------------------

This app is of course a proof-of-concept. The idea is to encrypt short messages
using the [Stanford Javascript Crypto Library](http://crypto.stanford.edu/sjcl/)

Javascript encryption is [by no means secure](http://www.matasano.com/articles/javascript-cryptography/).

### installation

Clone this repository. run `npm install` inside the securli directory.

### running

Start the app inside the securli dir:

`npm start`

Run tests with:

`npm test`

### contributing

Make sure to run the beatifier before each commit:

`npm run-script tidy`

Add unit tests where appropriate in the `test` directory and run

`npm test`

### challenges

We would like to propose the following challenges:

#### improve password hints

The app uses a `prompt` to allow the user to enter a password. This of course is not the best way to do this. Improve the password input by providing the user hints for a more secure password:

1. add an a algorithm that scores the password:

* password length: the longer the password, the better
* different characters: more points for passwords containing non-alpha chars
* variation: less points for passwords that contain repeating sequences of characters like `aaa`, `111`, etc.

Also provide feedback to the user about the strength of the password.

2. Password validity check

Our users often make the mistake of mistyping their password. Add a check that prevents this mistake from happening.

#### REST api

We would like to create an api service to accomodate our app. Create a `REST` api using rest verbs, exposing the current functionality: delete, create and view a message.

#### Scalability

Since the launch of our `REST` client, the number of users has been increasing. The current storage solution does not scale very well beyond a single machine. Improve the storage of secret message in such a way that it is no longer bound to a single machine.

#### Message expiry

Add a date field to the message, so that the user can choose an expiry date for his message. Once the message has expired, it can no longer be viewed. The messaged should be cleaned up when requested, and the user should get feedback that the message is no longer available.

#### User accounts

We would like to start offering a better service to our users, by allowing them to create an account, and list the messages they have created, so they can view and remove those messages.

#### Sending updates

Add a feature to the application, so that the creator of a message gets a copy of the email sent to the recepient, and receives an update when the message has been read.
