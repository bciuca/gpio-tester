## Raspberry Pi GPIO Tester

Simple GPIO input and output tester in the web browser. Good for quickly testing components without having to write any code.

### Installation

```
git clone raspi-test
npm install
```

### Usage

Start the server `node app`
<br>
In a web browser go to http://[your pi ip]:8080. The GPIOs can be set as either "in" or "out". When in "out" mode, ticking the i/o checkbox will write a value of 1 to the GPIO, unchecked will write 0.
