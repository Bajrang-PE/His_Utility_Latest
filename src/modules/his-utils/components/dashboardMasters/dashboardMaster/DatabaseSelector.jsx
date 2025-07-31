function DatabaseSelector({ dispatcher }) {
  function handleDBForm(dbType) {
    console.log("working..." + dbType);
    dispatcher({ type: dbType });
  }

  return (
    <div id="container" className="grid_container">
      <div className="flex_item" onClick={() => handleDBForm("postgres")}>
        <img
          src="/postgresql-icon.svg"
          alt="postgres db"
          className="database_logo"
        />
      </div>
      <div className="flex_item" onClick={() => handleDBForm("oracle")}>
        <img
          src="/oracle-svgrepo-com.svg"
          alt="Oracle db"
          className="database_logo"
        />
      </div>
      <div className="flex_item" onClick={() => handleDBForm("edb")}>
        <img
          src="/EDB EnterpriseDB.svg"
          alt="EDB DB"
          className="database_logo"
        />
      </div>
    </div>
  );
}

function DBConfigForm({ dbType, dispatcher, formState }) {
  function handleHostnameChange(e) {
    e.preventDefault();
    dispatcher({
      type: "updateHostname",
      payload: e.target.value,
    });
  }

  function handlePortChange(e) {
    e.preventDefault();
    dispatcher({
      type: "updatePort",
      payload: e.target.value,
    });
  }

  function handleHostnameChange(e) {
    e.preventDefault();
    dispatcher({
      type: "updateHostname",
      payload: e.target.value,
    });
  }

  function handleSIDChange(e) {
    e.preventDefault();
    dispatcher({
      type: "updateSID",
      payload: e.target.value,
    });
  }

  function handleUsernameChange(e) {
    e.preventDefault();
    dispatcher({
      type: "updateUsername",
      payload: e.target.value,
    });
  }

  function handleSchemaChange(e) {
    e.preventDefault();
    dispatcher({
      type: "updateSchema",
      payload: e.target.value,
    });
  }

  function handlePasswordChange(e) {
    e.preventDefault();
    dispatcher({
      type: "updatePassword",
      payload: e.target.value,
    });
  }

  return (
    <form className="form_body">
      <div className="form_element_wrapper">
        <label className="form_label" for="hostnameField">
          Hostname
        </label>
        <input
          type="text"
          placeholder="Enter Hostname"
          id="hostnameField"
          className="form_field"
          onChange={handleHostnameChange}
          value={formState.hostname}
          required="true"
        />
      </div>
      <div className="form_element_wrapper">
        <label className="form_label" for="portField">
          Port
        </label>
        <input
          type="text"
          placeholder="Enter Port Number"
          id="portField"
          value={formState.port}
          onChange={handlePortChange}
          className="form_field"
          required="true"
        />
      </div>
      <div className="form_element_wrapper">
        <label className="form_label" for="serviceField">
          {dbType === "postgres" ? "Database name" : "Service Name / SID"}
        </label>
        <input
          type="text"
          placeholder={
            dbType === "postgres"
              ? "Enter DB name"
              : "Enter Service Name or SID"
          }
          id="serviceField"
          value={formState.serviceName}
          onChange={handleSIDChange}
          className="form_field"
          required="true"
        />
      </div>
      <div className="form_element_wrapper">
        <label className="form_label" for="usernameField">
          Username
        </label>
        <input
          type="text"
          placeholder="Enter Username"
          id="usernameField"
          className="form_field"
          value={formState.userName}
          onChange={handleUsernameChange}
          required="true"
        />
      </div>
      <div className="form_element_wrapper">
        <label className="form_label" for="passwordField">
          Password
        </label>
        <input
          type="password"
          placeholder="Enter Password"
          id="passwordField"
          className="form_field"
          value={formState.password}
          onChange={handlePasswordChange}
          required="true"
        />
      </div>
      <div className="form_element_wrapper">
        <label className="form_label" for="schemaField">
          Schema
        </label>
        <input
          type="text"
          placeholder="Enter Schema Name"
          id="schemaField"
          className="form_field"
          value={formState.schema}
          onChange={handleSchemaChange}
          required="true"
        />
      </div>
    </form>
  );
}

export { DatabaseSelector, DBConfigForm };
