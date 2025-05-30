import { useEffect, useRef, useState } from "react";
import QRCode from "react-qr-code";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import authApi from "@/api/auth";
import { AlertMessage } from "@/components/ui/alert-message";
import { setCredentials } from "@/features/auth/authSlice";

const QR_EXPIRE_TIME = 180 * 1000;

export const QRLoginBox = () => {
  const [sessionId, setSessionId] = useState(null);
  const [qrExpired, setQrExpired] = useState(false);
  const qrTimeout = useRef(null);
  const pollingInterval = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Tạo mã QR mới
  const getQR = async () => {
    try {
      const res = await authApi.createQRSession();
      console.log(res.sessionId);
      const { sessionId } = res;

      setSessionId(sessionId);
      setQrExpired(false);

      // Set timeout QR hết hạn
      clearTimeout(qrTimeout.current);
      qrTimeout.current = setTimeout(() => {
        setSessionId(null);
        setQrExpired(true);
      }, QR_EXPIRE_TIME);
    } catch (err) {
      console.error("❌ Unable to generate QR code:", err);
      AlertMessage({ type: "error", message: "Unable to generate QR code" });
    }
  };

  // Gọi khi QR được tạo → polling liên tục
  useEffect(() => {
    if (!sessionId) return;

    pollingInterval.current = setInterval(async () => {
      try {
        const res = await authApi.checkQRStatus(sessionId);
        console.log(res);

        if (res.status === "VERIFIED") {
          const { user, token, refreshToken } = res;

          // Cập nhật Redux
          dispatch(setCredentials({ user, token, refreshToken }));

          // Lưu vào localStorage
          localStorage.setItem("token", token);
          localStorage.setItem("refreshToken", refreshToken);
          localStorage.setItem("user", JSON.stringify(user));

          clearInterval(pollingInterval.current);
          clearTimeout(qrTimeout.current);

          AlertMessage({ type: "success", message: "QR login successful!" });
          navigate("/home");
        }
      } catch (err) {
        console.error("❌ Error checking QR:", err);
      }
    }, 2000);

    return () => clearInterval(pollingInterval.current);
  }, [sessionId]);

  // Lấy QR lần đầu
  useEffect(() => {
    getQR();
    return () => {
      clearInterval(pollingInterval.current);
      clearTimeout(qrTimeout.current);
    };
  }, []);

  return (
    <div className="mt-6">
      <h3 className="text-center text-gray-600 text-sm">Login with QR code</h3>
      {qrExpired ? (
        <div className="text-center mt-4">
          <p className="text-sm text-gray-500">⚠️ QR code has expired</p>
          <button
            onClick={getQR}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Refresh QR code
          </button>
        </div>
      ) : sessionId ? (
        <div className="flex justify-center mt-4">
          <QRCode value={`qrlogin:${sessionId}`} size={180} />
        </div>
      ) : (
        <p className="text-center text-sm text-gray-500 mt-2">
          Generating QR code...
        </p>
      )}
    </div>
  );
};
