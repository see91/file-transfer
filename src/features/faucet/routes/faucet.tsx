import "../assets/style/faucet.less";
import { TextField, AlertColor } from "@mui/material";
import OvalButton from "@/components/Button/OvalButton";
import { useState } from "react";
import { utils } from "ethers";
import Loading from "@/components/Layout/Loading";
import Alert from "@/components/Layout/Alert";
import { giveMeTnlk } from "../api/faucet";
import HCaptcha from "@hcaptcha/react-hcaptcha";
import { hCaptchaSitekey } from "@/config";

export const Faucet = () => {
  const [address, setAddress] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [showHCaptcha, setShowHCaptcha] = useState<boolean>(false);
  const [severity, setSeverity] = useState<AlertColor>("error");
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [showLoading, setShowLoading] = useState<boolean>(false);
  const isAddress = () => utils.isAddress(address.toLowerCase());

  const _giveMeTnlk = async (token) => {
    setShowLoading(true);
    try {
      const { code, msg } = await giveMeTnlk({ address, verify_token: token });
      if (code === 2000) {
        setSeverity("success");
      } else {
        setSeverity("error");
      }
      setAlertMessage(msg);
      setShowLoading(false);
    } catch (x) {
      setAlertMessage("error");
      setSeverity("error");
      setShowLoading(false);
    } finally {
      setShowHCaptcha(false);
    }
    setOpen(true);
  };

  const _onVerify = (token) => {
    _giveMeTnlk(token);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="contriner">
      {showLoading && <Loading />}
      <Alert
        open={open}
        severity={severity}
        onClose={handleClose}
        message={alertMessage}
      />
      <div className="main-layout faucet">
        <div className="main-content">
          <h2 className="faucet-title">Horus Faucet</h2>
          <div className="content">
            <TextField
              className="address-input"
              id="outlined-basic"
              label="Input your nulink agent address"
              value={address}
              onChange={(e: any) => {
                setAddress(e.target.value);
              }}
            />
            <div className="func-btn">
              {showHCaptcha ? (
                <div className="h-captcha">
                  <HCaptcha sitekey={hCaptchaSitekey} onVerify={_onVerify} />
                </div>
              ) : (
                <OvalButton
                  title="Give me TNLK"
                  disabled={!isAddress()}
                  onClick={() => {
                    setShowHCaptcha(true);
                  }}
                />
              )}
            </div>
          </div>
          <a
            href="https://testnet.binance.org/faucet-smart"
            target="_blank"
            className="bsc-faucet-smart"
          >
            Get the BNB: Binance Smart Chain Faucet
          </a>
        </div>
      </div>
    </div>
  );
};
