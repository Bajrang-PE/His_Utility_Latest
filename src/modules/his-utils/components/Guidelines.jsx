import { StaticDataAccordian } from "./Accordian";

export default function Guidelines({ heading, guideLines }) {
  return (
    <div className="guideLines">
      <StaticDataAccordian data={guideLines} label={heading} />
    </div>
  );
}

function ErrorNotification({ errors }) {
  return (
    <div className="error">
      <div className="error__text">
        <img
          className="error__text--img"
          src="/error.png"
          alt="Please Correct Below Errors"
        />
        <h3 className="error__text--heading">
          Found Some Errors In Your Configuration
        </h3>
      </div>
      <ul className="error__para">
        {errors.map((data, index) => {
          return (
            <li className="error__desc" key={index}>
              {data}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export { ErrorNotification };
