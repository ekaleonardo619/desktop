import { useEffect, useState } from "react";
import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonList,
  IonPage,
  IonTextarea,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import "./Home.css";

import { Sticker } from "@juleb/capacitor";
const Home: React.FC = () => {
  const ELECTRON = window.require("electron");
  const [command, setCommand] = useState("");
  const [response, setResponse] = useState("");
  const [printerName, setPrinterName] = useState("");
  const [portNumber, setPortNumber] = useState(9301);
  const [platform, setPlatform] = useState("");
  const [desktopVersion, setDesktopVersion] = useState("1.0.5");

  useEffect(() => {
    const savedPlatform = localStorage.getItem("platform");
    const savedPrinter = localStorage.getItem("printer");
    const savedPort = localStorage.getItem("port");
    if (savedPlatform) {
      setPlatform(savedPlatform);
    }
    if (savedPrinter) {
      setPrinterName(savedPrinter);
    }
    if (savedPort) {
      setPortNumber(parseInt(savedPort));
    }
    if (savedPlatform && savedPort && savedPrinter) {
      Sticker.startServer(parseInt(savedPort), savedPrinter);
    }

    ELECTRON.ipcRenderer.send("app_version");
    ELECTRON.ipcRenderer.on("app_version", (event, arg) => {
      ELECTRON.ipcRenderer.removeAllListeners("app_version");
      if (arg.version) {
        setDesktopVersion(arg.version);
      }
    });
  }, []);
  return (
    <IonPage id="home-page">
      {/* <IonHeader>
        <IonToolbar>
          <IonTitle>Inbox</IonTitle>
        </IonToolbar>
      </IonHeader> */}
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Inbox</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonList>
          {/* ----- Enter platform name ----- */}
          <div>
            <IonInput
              placeholder="Enter platform.."
              value={platform}
              onIonChange={(event) => {
                setPlatform(event.detail.value || "");
                localStorage.setItem("platform", event.detail.value || "");
              }}
            />
          </div>
          {/* ----- Enter Printer name ----- */}
          <div>
            <IonInput
              placeholder="Enter Printer Name.."
              value={printerName}
              onIonChange={(event) => {
                setPrinterName(event.detail.value || "");
                localStorage.setItem("printer", event.detail.value || "");
              }}
            />
          </div>
          {/* ----- Enter Port Name ----- */}
          <div>
            <IonInput
              type="number"
              placeholder="Enter Port Number.."
              value={portNumber}
              onIonChange={(event) => {
                setPortNumber(parseInt(event.detail.value || "9301"));
                localStorage.setItem("port", event.detail.value || "9301");
              }}
            />
          </div>
          {/* <div>
            <IonTitle>Printer name is: {{printerName}}</IonTitle>
          </div> */}
          {/* ----- START SERVER ------ */}
          <IonButton
            shape="round"
            onClick={async () => {
              Sticker.startServer(portNumber, printerName);
            }}
          >
            Start Server 2
          </IonButton>
          {/* ----- DIRECT COMMANDS ----- */}
          <div>
            <IonTextarea
              placeholder="command to run.."
              value={command || undefined}
              onIonChange={(event) => setCommand(event.detail.value || "")}
            />
          </div>
          <IonButton
            shape="round"
            onClick={async () => {
              const res = await Sticker.printZpl(command);
              console.log(res.stdout);
              console.log(res.stderr);
              setResponse(JSON.stringify(res));
              // ipcRenderer.send('perform-action', { test: 'test' });
            }}
          >
            Run Command
          </IonButton>
          <div>{response}</div>
          <div>Version {desktopVersion}</div>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Home;
