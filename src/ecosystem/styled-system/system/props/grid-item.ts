import type * as CSS from 'csstype';
import { system } from 'styled-system';
import { type ResponsiveValue } from '../types';

export const customGridItem = system({
  colSpan: {
    property: 'gridColumn',
  },
  rowSpan: {
    property: 'gridRow',
  },
  colStart: {
    property: 'gridColumnStart',
  },
  colEnd: {
    property: 'gridColumnEnd',
  },
  rowStart: {
    property: 'gridRowStart',
  },
  rowEnd: {
    property: 'gridRowEnd',
  },
});

export interface GridItemProps {
  /**
   * The CSS `grid-column` property.
   *
   * The grid-column CSS shorthand property specifies a grid item's size and location within a grid column by contributing a line,
   * a span, or nothing (automatic) to its grid placement, thereby specifying the inline-start and inline-end edge of its grid area.
   *
   * @see [Mozilla Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-column)
   */
  colSpan?: ResponsiveValue<CSS.Property.GridColumn>;
  /**
   * The CSS `grid-row` property.
   *
   * The grid-row CSS shorthand property specifies a grid item's size and location within a grid row by contributing a line, a span,
   * or nothing (automatic) to its grid placement, thereby specifying the inline-start and inline-end edge of its grid area.
   *
   * @see [Mozilla Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-row)
   */
  rowSpan?: ResponsiveValue<CSS.Property.GridRow>;
  /**
   * The CSS `grid-column-start` property.
   *
   * The grid-column-start CSS property specifies a grid item's start position within the grid column by contributing a line,
   * a span, or nothing (automatic) to its grid placement. This start position defines the block-start edge of the grid area.
   *
   * @see [Mozilla Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-column-start)
   */
  colStart?: ResponsiveValue<CSS.Property.GridColumnStart>;
  /**
   * The CSS `grid-column-end` property.
   *
   * The grid-column-end CSS property specifies a grid item's end position within the grid column by contributing a line,
   * a span, or nothing (automatic) to its grid placement, thereby specifying the block-end edge of its grid area.
   *
   * @see [Mozilla Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-column-end)
   */
  colEnd?: ResponsiveValue<CSS.Property.GridColumnEnd>;
  /**
   * The CSS `grid-row-start` property.
   *
   * The grid-row-start CSS property specifies a grid item's start position within the grid row by contributing a line,
   * a span, or nothing (automatic) to its grid placement, thereby specifying the inline-start edge of its grid area.
   *
   * @see [Mozilla Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-row-start)
   */
  rowStart?: ResponsiveValue<CSS.Property.GridRowStart>;
  /**
   * The CSS `grid-row-end` property.
   *
   * The grid-row-end CSS property specifies a grid item's end position within the grid row by contributing a line,
   * a span, or nothing (automatic) to its grid placement, thereby specifying the inline-end edge of its grid area.
   *
   * @see [Mozilla Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-row-end)
   */
  rowEnd?: ResponsiveValue<CSS.Property.GridRowEnd>;
}
