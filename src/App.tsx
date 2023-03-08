import "./App.css";
import "antd/dist/antd.min.css";
// common css
import "./assets/style/index.less";
import { Suspense, useEffect, useState } from "react";
import { MainLayout } from "@/components/Layout";
import { message } from "antd";
// import { UsePopup } from "@/components/Popup";

function App() {
  message.config({
    maxCount: 1,
    rtl: true,
  });

  useEffect(() => {});

  // console.log('Basic ' + Buffer.from("projectId" + ':' + projectSecret).toString('base64'));
  // const [visible, setVisible] = useState(false);

  // const testHandler = () => {
  //   const nulink = globalThis.nulink;

  //   nulink !== undefined &&
  //     nulink.sendMessage(
  //       {
  //         type: "connectWallet",
  //         data: { key1: 1, key2: { key33: 3 } },
  //         // id: "1234566777",
  //       },
  //       function (response) {
  //         console.log(
  //           "connectWallet response",
  //           response.type,
  //           response.data,
  //           response.id,
  //         );
  //       },
  //     );
  //   // const nulink = globalThis.nulink;
  //   // Start a long-running conversation:
  //   var portHandler;
  //   portHandler = nulink.connectNuLink();
  //   portHandler.onMessage.addListener(function (message) {
  //     //get message from extension
  //     console.log("web page get info from extension: ", message);
  //     return true;
  //   });

  //   // portHandler.onDisconnect.addListener(() => {
  //   //   portHandler = undefined;
  //   //   console.log(
  //   //     "The connection with Nulink is lost, please refresh current page",
  //   //   );
  //   //   portHandler = nulink.connectNuLink();
  //   // });

  //   // portHandler.postMessage("test");
  //   // portHandler.postMessage({
  //   //   type: "connectWallet",
  //   //   data: { key1: 1, key2: { key33: 3 } },
  //   //   id: "1234566777",
  //   // });

  //   // var evt = new CustomEvent("message", {
  //   //   detail: {
  //   //     type: "connectWallet",
  //   //     data: { key1: 1, key2: { key33: 3 } },
  //   //     id: "1234566777",
  //   //   },
  //   // });
  //   // // Set up event listeners
  //   // document.addEventListener(
  //   //   "message",
  //   //   function (event) {
  //   //     // e.target :that is, listen for the event target element
  //   //     console.log("receive hello message");
  //   //   },
  //   //   false,
  //   // );
  //   // // Trigger event listening
  //   // document.dispatchEvent(evt);

  //   // window.chrome.runtime.sendMessage(laserExtensionId, {type:  "connectWallet", data: {"key1":1,"key2": {key33: 3}}, id: '1234566777'}, function(response) {
  //   //   console.log("connectWallet response", response.type, response.data, response.id);
  //   // });

  //   // window.chrome.runtime.sendMessage(laserExtensionId, {type:  "test", data: {"key1":1,"key2": {key33: 3}}, id: '1234566777'}, function(response) {
  //   //   console.log("test response", response.type, response.data, response.id);
  //   // });
  // };

  const receiveMessage = (event) => {
    // console.log("fn `receiveMessage` respond data: ", event);

    messageHandler(event);
  };
  const messageHandler = (event) => {
    const { type } = event.data;
    // console.log("messageHandler: ", messageHandler);
    switch (type) {
      case "connectedAgent":
        // Set login statue true at the top right direction of web
        // console.log("Connected Agent");
        break;
      case "MESSAGE_PAY_KEY":
        // Set auth popup submit and thenclose, and give a tip to user, result of payment
        // console.log(
        //   "Payment has been ",
        //   data?.status,
        //   ". The verify code is ",
        //   data?.key,
        // );
        break;
      case "test_message_type":
        // console.log("[message]", event.data.data);
        break;
      default:
        // console.log("[message]", event.data.data);
        break;
    }
  };

  window.addEventListener("message", receiveMessage);

  return (
    <div className="App">
      {/* <button onClick={testHandler}>Test</button> */}
      {/* <button onClick={()=> setVisible(true)}>Popup</button> */}
      <Suspense fallback={<div></div>}>
        <MainLayout> </MainLayout>
      </Suspense>
      {/* <UsePopup visible={visible} onChange={setVisible} content="Operate success!" /> */}
    </div>
  );
}

export default App;
