import { FC, FocusEvent } from 'react';
import { FieldTitle, InputHelperText, InputProps, LabeledProps, useInput, useLocale } from 'react-admin';
import { SunEditorOptions } from 'suneditor/src/options';
import { debounce } from 'src/utils/debounce';
import SunEditor, { buttonList } from 'suneditor-react';
import { FormHelperText, FormControl, InputLabel } from '@material-ui/core';
import uk from 'suneditor/src/lang/ua';

const content = {
  uk,
};

export interface RichTextInputProps extends InputProps, Omit<LabeledProps, 'children'> {
  editorOptions?: Partial<SunEditorOptions>;
  label?: string;
  fullWidth?: boolean;
  helperText?: string;
}

export const RichTextInput: FC<RichTextInputProps> = ({ source, resource, label, fullWidth, helperText, ...rest }) => {
  const locale = useLocale();
  const {
    id,
    isRequired,
    input: { onChange, value, onBlur, onFocus },
    meta: { touched, error },
  } = useInput({ source, ...rest });

  const onEditorChange = debounce((content: string) => {
    const value = content === '<p><br></p>' ? '' : content;

    onChange(value);
  }, 10);

  return (
    <FormControl error={!!(touched && error)} fullWidth={fullWidth} className="ra-rich-text-input">
      <InputLabel shrink htmlFor={id}>
        <FieldTitle label={label} source={source} resource={resource} isRequired={isRequired} />
      </InputLabel>
      <SunEditor
        lang={content[locale as keyof typeof content]}
        onChange={onEditorChange}
        onFocus={(event) => onFocus(event as unknown as FocusEvent<HTMLElement, Element>)}
        onBlur={(event) => onBlur(event as unknown as FocusEvent<HTMLElement, Element>)}
        defaultValue={value}
        setOptions={{
          height: '210px',
          stickyToolbar: -1,
          buttonList: buttonList.complex,
        }}
      />
      <FormHelperText error={!!error} className={!!error ? 'ra-rich-text-input-error' : ''}>
        <InputHelperText error={error} helperText={helperText} touched={!!touched} />
      </FormHelperText>
    </FormControl>
  );
};
