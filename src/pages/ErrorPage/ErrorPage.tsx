import { useRouteError } from "react-router-dom";
import { JSX } from "react";
import styles from "./ErrorPage.module.scss";

export default function ErrorPage(): JSX.Element {
  const error: unknown = useRouteError();
  console.error(error);
  return (
    <div className={styles.error_page} id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        <i>
          {(error as Error)?.message ||
            (error as { statusText?: string })?.statusText}
        </i>
      </p>
    </div>
  );
}
