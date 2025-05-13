# frontend

The frontend is created in React. Check React documentation for how to manage a react project. `package-lock.json` contains the required node packages.

This project was created with [Create React App](https://github.com/facebook/create-react-app).

## As a systemd service

The production server is run using the following systemd service unit at `/etc/systemd/system/autonav-frontend.service`

```
[Unit]
Description=Autonav Frontend Service
After=network.target

[Service]
User=autonav
Group=autonav

WorkingDirectory={Frontend Directory here}

ExecStart=/usr/local/bin/serve -s build -l 3000

Restart=on-failure

StandardOutput=file:{AUTONAV LOG DIRECTORY}/frontend_latest.log
StandardError=file:{AUTONAV LOG DIRECTORY}/frontend_error.log

[Install]
WantedBy=multi-user.target
```

Note that the working directory and log directory depend on your setup. In our case, it was `/opt/autonav` and `/opt/autonav/logs`, respectively.

## Built-in Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
