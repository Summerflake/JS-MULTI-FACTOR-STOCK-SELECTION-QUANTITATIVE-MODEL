# JS-MULTI-FACTOR-STOCK-SELECTION-QUANTITATIVE-MODEL

## Overview
#### A code simple but robust stock selection quantitative model named S.T.E.F built on javascript and integrating several api endponints and formulas including original ones.

## Features
### Short Term
- [x] Public Sentiment
- [x] Technical Sentiment
### Long Term
- [x] ESG Analysis
- [x] Fundamental Analysis

| Indicator Type | Weight in Section | Number of Metrics Used |
|----------|----------|----------|
| Sentiment (Public) | 40% Short Term     | 7        |
| Technical Sentiment    | 60% Short Term     | 27      |
| ESG Analysis  |  40% Long Term     |  4    |
| Fundamental Analysis  | 60% Long Term     | 23      |
| Total      | |61      |

TODO:
- [ ] Add customisable configuration files
- [ ] Document all original formulas used
- [ ] Complete front end version of the code

## Dependencies
[Financial Modeling Prep API](https://financialmodelingprep.com/) 

[Yahoo Finance](https://finance.yahoo.com/) 

[All Origins](https://api.allorigins.win/) 

[Trading View](https://scanner.tradingview.com/)

[CNN Fear Greed](https://production.dataviz.cnn.io/index/fearandgreed/graphdata) 

## Usage
This is the back end skeleton of the model, where in ```data.html``` run ```main("Security_Symbol", "Exchange_Centre", API_KEY);```. Then the front end results can be viewed at ```menu.html```. 

