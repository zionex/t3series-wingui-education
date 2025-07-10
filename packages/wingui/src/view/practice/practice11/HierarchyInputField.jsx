import React, { forwardRef, useState, useImperativeHandle, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import InputField from "@zionex/wingui-core/component/input/InputField";
import { transLangKey } from "@zionex/wingui-core";

const HierarchyInputField = forwardRef((props, ref) => {
  const { control, getValues, setValue, watch, reset } = useForm();
  const [optionsData, setOptionsData] = useState([]);

  const { data, option, onChange } = props;
  const {
    items = [],
    labels = [],
    type: types = [],
    allflag = [],
    rtnAllYn = []
  } = option || {};

  const getAllFlag = (idx) => Array.isArray(allflag) ? allflag[idx] : allflag;
  const getRtnAllYn = (idx) => Array.isArray(rtnAllYn) ? rtnAllYn[idx] : rtnAllYn;

  useImperativeHandle(ref, () => ({
    reset: () => reset(),

    getValues: () => {
      const rawValues = getValues();
      const result = {};

      items.forEach((itemKey, idx) => {
        const fieldValue = rawValues[itemKey];
        const isMulti = types[idx] === "multiSelect";
        const isAll = getAllFlag(idx);
        const returnAll = getRtnAllYn(idx);
        const fieldOptions = optionsData[idx]?.map(opt => opt.value) || [];

        if (isMulti && isAll) {
          const cleanFieldValue = Array.isArray(fieldValue)
            ? fieldValue.filter(v => v !== 'ALL')
            : [];

          const allSelected =
            cleanFieldValue.length === fieldOptions.filter(v => v !== 'ALL').length &&
            cleanFieldValue.every(val => fieldOptions.includes(val));

          result[itemKey] = allSelected
            ? (returnAll ? "ALL" : fieldOptions.filter(v => v !== 'ALL'))
            : cleanFieldValue;

        } else if (!isMulti && isAll) {
          result[itemKey] = (fieldValue === "ALL")
            ? (returnAll ? "ALL" : fieldOptions.filter(v => v !== 'ALL'))
            : fieldValue;
        } else {
          result[itemKey] = fieldValue;
        }
      });

      return result;
    },

    setValues: (records) => {
      if (!Array.isArray(records) || records.length === 0) return;

      const extractUnique = (key) =>
        [...new Set(records.map(r => r[key]).flat().filter(v => v != null && v !== ""))];

      const values = {};
      const updatedOptions = [];

      items.forEach((itemKey, idx) => {
        const cdKey = `${itemKey}_CD`;
        const isMulti = types[idx] === 'multiSelect';
        const isAll = getAllFlag(idx);
        const returnAll = getRtnAllYn(idx);

        const filteredOptions = getFilteredOptions(idx, values);
        updatedOptions[idx] = filteredOptions;

        const allOptionValues = filteredOptions.map(opt => opt.value).filter(v => v !== "ALL");
        const rawUnique = extractUnique(cdKey);
        const cleanUniqueValues = rawUnique.filter(v => allOptionValues.includes(v));
        const hasValidValue = cleanUniqueValues.length > 0;

        if (isMulti) {
          if (!hasValidValue) {
            values[itemKey] = isAll
              ? allOptionValues
              : (filteredOptions.length > 0 ? [filteredOptions[0].value] : []);
          } else {
            const isAllSelected =
              cleanUniqueValues.length === allOptionValues.length &&
              cleanUniqueValues.every(v => allOptionValues.includes(v));

            values[itemKey] = isAll
              ? (returnAll && isAllSelected ? allOptionValues : cleanUniqueValues)
              : cleanUniqueValues;
          }
        } else {
          if (!hasValidValue) {
            values[itemKey] = isAll
              ? (returnAll ? "ALL" : (filteredOptions.length > 0 ? filteredOptions[0].value : undefined))
              : (filteredOptions.length > 0 ? filteredOptions[0].value : undefined);
          } else {
            values[itemKey] = isAll && returnAll && cleanUniqueValues.length > 1
              ? "ALL"
              : cleanUniqueValues[0];
          }
        }

        setValue(itemKey, values[itemKey]);
      });

      setOptionsData(updatedOptions);
      if (onChange) onChange(getValues());
    }
  }));

  const getFilteredOptions = (level, selectedValues) => {
    let filtered = [...data];
    for (let i = 0; i < level; i++) {
      const key = `${items[i]}_CD`;
      const val = selectedValues[items[i]];
      const isAll = getAllFlag(i);

      if (val === "ALL" && isAll && types[i] === "select") continue;

      if (Array.isArray(val)) {
        filtered = filtered.filter(row => val.includes(row[key]));
      } else {
        filtered = filtered.filter(row => row[key] === val);
      }
    }

    const currentKey = `${items[level]}_CD`;
    const currentName = `${items[level]}_NM`;

    const unique = Array.from(
      new Map(
        filtered.map(row => [row[currentKey], {
          value: row[currentKey],
          label: row[currentName]
        }])
      ).values()
    );

    if (types[level] === "select" && getAllFlag(level)) {
      unique.unshift({ value: "ALL", label: transLangKey("ALL") });
    }

    return unique;
  };

  useEffect(() => {
    if (!data || !items.length) return;

    const initialValues = {};
    const allOptions = [];

    for (let i = 0; i < items.length; i++) {
      const filteredOptions = getFilteredOptions(i, initialValues);
      allOptions.push(filteredOptions);

      const isAll = getAllFlag(i);
      let firstValue;

      if (types[i] === "multiSelect") {
        firstValue = isAll
          ? filteredOptions.map(opt => opt.value)
          : filteredOptions.length > 0 ? [filteredOptions[0].value] : [];
      } else if (types[i] === "select") {
        firstValue = isAll
          ? "ALL"
          : filteredOptions.length > 0 ? filteredOptions[0].value : undefined;
      }

      initialValues[items[i]] = firstValue;
      setValue(items[i], firstValue);
    }

    setOptionsData(allOptions);
    if (onChange) onChange(getValues());
  }, [data]);

  useEffect(() => {
    const subscription = watch((values, { name }) => {
      const changedIdx = items.indexOf(name);
      if (changedIdx === -1 || changedIdx === items.length - 1) return;

      const updatedValues = getValues();
      const newOptions = [...optionsData];

      for (let i = changedIdx + 1; i < items.length; i++) {
        const filtered = getFilteredOptions(i, updatedValues);
        newOptions[i] = filtered;

        if (filtered.length === 0) continue;

        const isAll = getAllFlag(i);
        const defaultValue =
          types[i] === "multiSelect"
            ? isAll
              ? filtered.map(opt => opt.value)
              : [filtered[0].value]
            : isAll
              ? "ALL"
              : filtered[0].value;

        setValue(items[i], defaultValue);
        updatedValues[items[i]] = defaultValue;
      }

      setOptionsData(newOptions);
      if (onChange) onChange(getValues());
    });

    return () => subscription.unsubscribe();
  }, [optionsData]);

  return (
    <>
      {items.map((itemKey, idx) => (
        <Controller
          key={itemKey}
          name={itemKey}
          control={control}
          render={({ field }) => (
            <InputField
              type={types[idx] || "select"}
              label={transLangKey(labels[idx]) || itemKey}
              options={optionsData[idx] || []}
              {...field}
            />
          )}
        />
      ))}
    </>
  );
});

export default HierarchyInputField;