import { forwardRef, useImperativeHandle, useState } from 'react';
import { InputField } from './dragdrop/FormElements';
import { PlusButton, SubstractButton } from './Buttons';

const ComboBuilder = forwardRef(({ optionLable, optionValue }, ref) => {
  useImperativeHandle(ref, () => ({
    getValue: () => options,
  }));

  const [options, setOptions] = useState([{ label: '', value: '' }]);

  const handleChange = (index, field, value) => {
    const updatedOptions = [...options];
    updatedOptions[index][field] = value;
    setOptions(updatedOptions);
  };

  const addOption = () => {
    setOptions([...options, { label: '', value: '' }]);
  };

  const removeOption = (index) => {
    const updatedOptions = [...options];
    updatedOptions.splice(index, 1);
    setOptions(updatedOptions);
  };

  return (
    <div className="parameterMaster__config">
      {options.map((option, index) => (
        <div key={index} className="optionBlock">
          <InputField
            label={optionLable}
            value={option.label}
            fieldType={'text'}
            onChange={(e) => handleChange(index, 'label', e.target.value)}
          />
          <InputField
            label={optionValue}
            value={option.value}
            fieldType={'text'}
            onChange={(e) => handleChange(index, 'value', e.target.value)}
          />
          {options.length > 1 && (
            <SubstractButton handler={() => removeOption(index)} />
          )}
        </div>
      ))}
      <PlusButton handler={addOption} />
    </div>
  );
});

export default ComboBuilder;
