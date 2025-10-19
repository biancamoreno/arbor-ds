import type * as CSS from 'csstype';
import { system } from 'styled-system';
import { type Theme } from '../../tokens';
import { type Length, type ResponsiveValue, type Token } from '../types';

export const customGrid = system({
  columnGap: {
    property: 'gridColumnGap',
  },
  rowGap: {
    property: 'gridRowGap',
  },
  row: {
    property: 'gridRow',
  },
  column: {
    property: 'gridColumn',
  },
  area: {
    property: 'gridArea',
  },
  autoFlow: {
    property: 'gridAutoFlow',
  },
  autoRows: {
    property: 'gridAutoRows',
  },
  autoColumns: {
    property: 'gridAutoColumns',
  },
  templateColumns: {
    property: 'gridTemplateColumns',
  },
  templateRows: {
    property: 'gridTemplateRows',
  },
  templateAreas: {
    property: 'gridTemplateAreas',
  },
});

export interface GridProps {
  /**
   * The CSS `grid-template-columns` property.
   *
   * It defines the columns of the grid with a space-separated list of values.
   *
   * @see [Mozilla Docs](https://developer.mozilla.org/docs/Web/CSS/grid-template-columns)
   */
  templateColumns?: ResponsiveValue<CSS.Property.GridTemplateColumns>;
  /**
   * The CSS `grid-template-rows` property.
   *
   * It defines the rows of the grid with a space-separated list of values.
   *
   * @see [Mozilla Docs](https://developer.mozilla.org/docs/Web/CSS/grid-template-rows)
   */
  templateRows?: ResponsiveValue<CSS.Property.GridTemplateRows>;
  /**
   * The CSS `grid-template-areas` property.
   *
   * It defines named grid areas, establishing the cells in the grid and assigning names to them.
   *
   * @see [Mozilla Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template-areas)
   */
  templateAreas?: ResponsiveValue<CSS.Property.GridTemplateAreas>;
  /**
   * The CSS `grid-template` property.
   *
   * It is a shorthand for defining both `grid-template-rows` and `grid-template-columns`.
   *
   * @see [Mozilla Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template)
   */
  gridTemplate?: ResponsiveValue<CSS.Property.GridTemplate>;
  /**
   * The CSS `grid-column-gap` property.
   *
   * It defines the size of the gap between the columns in a grid layout.
   *
   * @see [Mozilla Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/column-gap)
   */
  columnGap?: ResponsiveValue<Token<Theme['space']> | CSS.Property.GridColumnGap<Length>>;
  /**
   * The CSS `grid-row-gap` property.
   *
   * It defines the size of the gap between the rows in a grid layout.
   *
   * @see [Mozilla Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/row-gap)
   */
  rowGap?: ResponsiveValue<Token<Theme['space']> | CSS.Property.GridRowGap<Length>>;
  /**
   * The CSS `grid-gap` property.
   *
   * The grid-auto-flow CSS property controls how the auto-placement algorithm works,
   * specifying exactly how auto-placed items get flowed into the grid.
   *
   * @see [Mozilla Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-auto-flow)
   */
  autoFlow?: ResponsiveValue<CSS.Property.GridAutoFlow>;
  /**
   * The CSS `grid-auto-columns` property.
   *
   * The grid-auto-rows CSS property specifies the size of an implicitly-created grid row track or pattern of tracks.
   *
   * @see [Mozilla Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-auto-rows)
   */
  autoRows?: ResponsiveValue<CSS.Property.GridAutoRows>;
  /**
   * The CSS `grid-row` property.
   *
   * The grid-row CSS shorthand property specifies a grid item's size and location within a grid row by contributing a line,
   * a span, or nothing (automatic) to its grid placement, thereby specifying the inline-start and inline-end edge of its grid area.
   *
   * @see [Mozilla Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-row)
   */
  row?: ResponsiveValue<CSS.Property.GridRow>;
  /**
   * The CSS `grid-column` property.
   *
   * The grid-column CSS shorthand property specifies a grid item's size and location within a grid column by contributing a line,
   * a span, or nothing (automatic) to its grid placement, thereby specifying the inline-start and inline-end edge of its grid area.
   *
   * @see [Mozilla Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-row)
   */
  column?: ResponsiveValue<CSS.Property.GridColumn>;
  /**
   * The CSS `grid-area` property.
   *
   * The grid-area CSS shorthand property specifies a grid item's size and location within a grid by contributing a line,
   * a span, or nothing (automatic) to its grid placement, thereby specifying the edges of its grid area.
   *
   * @see [Mozilla Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-area)
   */
  area?: ResponsiveValue<CSS.Property.GridArea>;
  /**
   * The CSS `grid-auto-columns` property.
   *
   * The grid-auto-columns CSS property specifies the size of an implicitly-created grid column track or pattern of tracks.
   *
   * @see [Mozilla Docs](https://developer.mozilla.org/en-US/docs/Web/CSS/grid-auto-columns)
   */
  autoColumns?: ResponsiveValue<CSS.Property.GridAutoColumns>;
}
