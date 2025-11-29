import React, { useState } from "react";

type Props = {
  userId: string;
};

export const TOTPInputScreen: React.FC<Props> = () => {
  const [code, setCode] = useState("");
  return (
    <form>
      <label htmlFor="totp-code">TOTPコード</label>
      <input
        id="totp-code"
        aria-label="TOTPコード"
        value={code}
        onChange={e => setCode(e.target.value)}
      />
      <button type="submit">認証</button>
    </form>
  );
};
