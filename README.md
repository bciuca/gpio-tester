## Raspberry Pi GPIO Tester

Simple GPIO input and output tester in the web browser. Quickly test components hooked up to the Raspberry Pi's GPIOs without having to write any code.

### Installation

```
git clone https://github.com/bciuca/gpio-tester.git
npm install
```

### Usage

Start the server `node app`

In a web browser, go to `http://[your pi ip]:8080`

Once the web app loads, choose a pin mode from the GPIO list. "Out" mode will write to the GPIO when the i/o checkbox is clicked -- checked is has a value of 1 otherwise 0. "In" mode will highlight the GPIO item on the page when triggered.

![](https://github.com/bciuca/gpio-tester/blob/master/public/img/screenshot.png)
