import React from "react";
import styles from "./styles.module.css";

type Props = { embedUrl: string; title: string };

export default function Index({ embedUrl, title }: Props) {
	return (
		<iframe
			className={styles.iframe}
			src={embedUrl}
			title={title}
			allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
			sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
		/>
	);
}
