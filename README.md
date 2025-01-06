# Computer-UI

### A Custom UI (Or Two) For My Computer

## About Project

This repository contains the source code for some custom electron windows showcasing system stats on my computer. I have wired two displays up through motherboard power and run them off of the main graphics card. They are then mounted to my case. Reach out to me for more details on how you can set this up for your project.

## Installation

Clone the repository and run the following command to build and run the app. Good luck!

```bash
npm install && npm start
```

Install [Open Hardware Monitor](https://openhardwaremonitor.org/). Open Hardware Monitor outputs through the WMI protocol. This is currently picked up via the WMIC addon to Windows.
In future versions of Windows this may be disabled, might need a workaround but for now you can add it via optional feature addons.

Once setup, you can schedule the task via Task Scheduler. Mine is configured with the script `powershell.exe` and arguments `-WindowStyle hidden -File /path/to/file`.
You may need to delay the task execution after login to allow graphics drivers and other high priority programs to start first.
