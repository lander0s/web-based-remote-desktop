## Web-based remote desktop

> Access your remote desktop using any modern web-browser

<p align="center"><img src="https://user-images.githubusercontent.com/5791055/64057520-e61e1a00-cb52-11e9-946c-a6d839fa0f52.gif" width="500"></p>

##### Supported platforms:
- Windows
- Linux
- MacOS

##### Installation
```
git clone https://github.com/DavidLanderosAlcala/remote-desktop-over-http.git
```

```
cd remote-desktop-over-http
```
```
npm install
```
> on Linux you have to install: __libxtst-dev__ and __libpng++-dev__ before running ```npm install```

##### Usage
> On the computer you want to access remotely
````
npm start
````
> It'll print the URL you have to access to, open said URL using any modern web browser and that's it
> 
<p align="center"><img src="https://user-images.githubusercontent.com/5791055/64057392-22507b00-cb51-11e9-8bb1-f86f47647da4.png" width="500"></p>

##### Features
- Keyboard input
- Mouse input
- Image quality selector
- Crop image
- Get system info

