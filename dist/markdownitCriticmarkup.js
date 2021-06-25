/*! markdown-it-criticmarkup 0.0.1-6 https://github.com//GerHobbelt/markdown-it-criticmarkup @license ISC */

/**
 * critic markup                HTML                    LaTeX
    {--[text]--}            <del>[text]</del>                     \st{[text]}
    {++[text]++}            <ins>[text]</ins>                     \underline{[text]}
    {~~[text1]~>[text2]~~}  <del>[text1]</del><ins>[text2]</ins>  \st{[text1]}\underline{[text2]}
    {==[text]==}            <mark>[text]</mark>                   \hl{[text]}
    {>>[text]<<}            <aside>[text]</aside>                 \marginpar{[text]}
  */

/**
 * CriticMarkup rule
 */
function critcmarkup_plugin(md) {
  md.inline.ruler.before('strikethrough', 'critic-markup', (state, silent) => {
    const src = state.src,
          pos = state.pos;

    if (src[pos] === '{' && (src[pos + 1] === '-' && src[pos + 2] === '-' || src[pos + 1] === '+' && src[pos + 2] === '+' || src[pos + 1] === '~' && src[pos + 2] === '~' || src[pos + 1] === '=' && src[pos + 2] === '=' || src[pos + 1] === '>' && src[pos + 2] === '>')) {
      let tag = src.slice(pos + 1, pos + 3);
      let closeTag = tag;

      if (closeTag[0] === '>') {
        closeTag = '<<}';
      } else {
        closeTag += '}';
      }

      let i = pos + 3,
          end = -1,
          content = null;

      while (i < src.length) {
        if (src.startsWith(closeTag, i)) {
          end = i;
          break;
        }

        i += 1;
      }

      if (end >= 0) {
        content = src.slice(pos + 3, end);
      } else {
        return false;
      }

      if (content && !silent) {
        const token = state.push('critic-markup');
        token.content = content;
        token.tag = tag;
        state.pos = end + closeTag.length;
        return true;
      }

      return false;
    }

    return false;
  });
  /**
   * CriticMarkup renderer
   */

  md.renderer.rules['critic-markup'] = (tokens, idx) => {
    const token = tokens[idx],
          tag = token.tag,
          content = token.content;

    if (tag === '--') {
      return `<del>${content}</del>`;
    } else if (tag === '++') {
      return `<ins>${content}</ins>`;
    } else if (tag === '==') {
      return `<mark>${content}</mark>`;
    } else if (tag === '>>') {
      return `<aside>${content}</aside>`;
    } // {~~[text1]~>[text2]~~}


    const arr = content.split('~>');

    if (arr.length === 2) {
      return `<del>${arr[0]}</del><ins>${arr[1]}</ins>`;
    }

    throw new Error(`Error: '~>' not found in critic markup chunk {~~${content}--}`);
  };
}

export default critcmarkup_plugin;
//# sourceMappingURL=markdownItCriticmarkup.modern.js.map
