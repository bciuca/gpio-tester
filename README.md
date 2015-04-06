## Raspberry Pi GPIO Tester

Simple GPIO input and output tester in the web browser. Good for quickly testing components without having to write any code.

### Installation

```
git clone https://github.com/bciuca/gpio-tester.git
npm install
```

### Usage

Start the server `node app`, nn a web browser, go to http://[your pi ip]:8080. The GPIOs can be set as either "in" or "out". Out mode will write to the GPIO when the i/o checkbox is clicked (checked is has a value of 1 otherwise 0).