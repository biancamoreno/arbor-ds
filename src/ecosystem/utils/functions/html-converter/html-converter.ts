import { type TextProps } from '../../../../components';

function parseHtmlAttributes(htmlAttrs: string): Record<string, string> {
  const attrRegex = /(\w+)="([^"]*)"/g;
  const styleAttrRegex = /([\w-]+)\s*:\s*([^;]+)/g;
  const attributes: Record<string, string> = {};
  let attrMatch: RegExpExecArray | null;

  if (!htmlAttrs) {
    return attributes;
  }

  while ((attrMatch = attrRegex.exec(htmlAttrs)) !== null) {
    const [, name, value] = attrMatch;

    if (name === 'style') {
      let styleMatch: RegExpExecArray | null;
      while ((styleMatch = styleAttrRegex.exec(value)) !== null) {
        const [, prop, val] = styleMatch;
        const camelCaseProp = prop.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
        if (camelCaseProp === 'fontFamily') {
          attributes['variant'] = val.trim();
        } else {
          attributes[camelCaseProp] = val.trim();
        }
      }
    } else {
      attributes[name] = value;
    }
  }

  return attributes;
}

const tagsMap: Record<
  string,
  (
    props: TextProps<string>,
    elements: TextProps<string>[],
    attributes: string,
    options?: TextProps<string>,
  ) => TextProps<string>
> = {
  b: props => {
    props.fontWeight = 'bold';
    props.as = 'b';
    return props;
  },
  u: props => {
    props.textDecorationLine = 'underline';
    props.as = 'u';
    return props;
  },
  ins: props => {
    props.textDecorationLine = 'underline';
    props.as = 'ins';
    return props;
  },
  s: props => {
    props.textDecorationLine = 'line-through';
    props.as = 's';
    return props;
  },
  del: props => {
    props.textDecorationLine = 'line-through';
    props.as = 'del';
    return props;
  },
  i: props => {
    props.fontStyle = 'italic';
    props.as = 'i';
    return props;
  },
  br: (props, elements) => {
    elements.push({ children: '\n' });
    return props;
  },
  a: (props, _, attributes) => {
    const { href, target, ...rest } = parseHtmlAttributes(attributes);
    props = {
      as: 'a',
      textDecorationLine: 'underline',
      ...props,
      ...rest,
      ...{ href, target },
    };
    return props;
  },
  span: (props, _, attributes) => {
    props = { as: 'span', ...props, ...parseHtmlAttributes(attributes) };
    return props;
  },
  font: (props, _, attributes) => {
    props = { as: 'span', ...props, ...parseHtmlAttributes(attributes) };
    return props;
  },
};

/**
 * @param html Texto em formato html. Exemplo: Hello \<b>World</b\>
 * @param options Propriedades globais que serão passadas para o componente de texto
 * @returns
 */
export function htmlConverter(html: string, options?: TextProps<string>): TextProps<string>[] {
  const cleanedHtml = html.trim();
  const matches = Array.from(cleanedHtml.matchAll(/<(\/?)(\w+)([^>]*)>|([^<>]+)/g));

  const elements: TextProps<string>[] = [];
  const stack: TextProps<string>[] = [];
  let props: TextProps<string> = {};

  matches.forEach(match => {
    const [, closing, tag, attributes, text] = match;

    if (tag) {
      if (closing) {
        props = stack.pop() || {};
      } else {
        stack.push({ ...props });
        if (tagsMap[tag]) {
          props = tagsMap[tag]?.(props, elements, attributes, options);
        }
      }
    }

    if (text) {
      elements.push({ ...props, children: text });
    }
  });

  return elements;
}

/**
 * Valida se a string contém html válido.
 * @param html Texto em html
 * @returns
 */
htmlConverter.isValidHtml = (html: string) => {
  const tagRegex = /<(\w+)[^>]*>.*?<\/\1>/;
  return tagRegex.test(html);
};
