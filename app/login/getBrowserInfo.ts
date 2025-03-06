// Desc: Get the browser, OS, and region information of the user

export default async function getBrowserInfo() {
  const userAgent = navigator.userAgent;
  let browser = "Unknown";
  let os = "Unknown";

  if (userAgent.indexOf("Firefox") > -1) {
    browser = "Firefox";
  } else if (userAgent.indexOf("Chrome") > -1) {
    browser = "Chrome";
  } else if (userAgent.indexOf("Safari") > -1) {
    browser = "Safari";
  } else if (userAgent.indexOf("MSIE") > -1 || !!(window as any).document.documentMode) {
    browser = "IE";
  }

  if (userAgent.indexOf("Win") > -1) {
    os = "Windows";
  } else if (userAgent.indexOf("Mac") > -1) {
    os = "MacOS";
  } else if (userAgent.indexOf("X11") > -1) {
    os = "UNIX";
  } else if (userAgent.indexOf("Linux") > -1) {
    os = "Linux";
  }

  return { browser, os };
}
