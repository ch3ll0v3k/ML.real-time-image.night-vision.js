##### ML.real-time-image.night-vision.js

ML-Network is only 24.0 Kb

Attach USB-Cam
Open public_html/index.html is browser.

It will start in auto-mode

------------------

Real-time processing:


[![print-all](https://github.com/ch3ll0v3k/ML.real-time-image.night-vision.js/master/public_html/example.0.png)]

[![print-all](https://github.com/ch3ll0v3k/ML.real-time-image.night-vision.js/master/public_html/example.1.png)]

[![print-all](https://github.com/ch3ll0v3k/ML.real-time-image.night-vision.js/master/public_html/example.2.png)]

[![print-all](https://github.com/ch3ll0v3k/ML.real-time-image.night-vision.js/master/public_html/example.3.png)]

[![print-all](https://github.com/ch3ll0v3k/ML.real-time-image.night-vision.js/master/public_html/example.4.png)]



##### Create dataset

```bash
SUBSET=30; 

# Can be 10-50, or your own value, higher the value == increase train time && quality 
# 10-30 will produce good result

node --max-old-space-size=8192 create-dataset.SUBSET.js $SUBSET
```

##### Train network

it will train 10 times && save network

```bash
while true; do node --max-old-space-size=8192 "./train.brainjs.$SUBSET.js" "./dataset.512x512.SUBSET.$SUBSET.json"; sync; done
```

##### "Ask" network (predict)

```bash
node ask.brainjs.SUBSET.js "brain.SUBSET.$SUBSET.json" "./any/dark/image.png" && <your-image-viewer> "out.SUBSET.$SUBSET.png"
```
