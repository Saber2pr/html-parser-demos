// 先写出bnf
// 介绍递归下降分析法
// 画出产生式图

export function parse(input: string) {
  let index = 0
  let current = input

  /**
   * prop -> key="value"
   */
  function prop() {
    let key
    let value

    match(' ')
    key = match(/\w+/)
    match('=')
    match('"')
    value = match(/\w+/)
    match('"')

    return {
      key,
      value,
    }
  }

  /**
   * element -> <tagName key="value" ></tagName>
   */
  function element() {
    let tagName
    let props
    let children

    match('<')
    tagName = match(/\w+/)
    props = prop()
    match(' ')
    match('>')

    children = opt(element)

    match('<')
    match('/')
    match(/\w+/)
    match('>')

    return {
      tagName,
      props,
      children,
    }
  }

  function opt(term: Function) {
    let fallback = index
    try {
      return term()
    } catch (error) {
      current = input.slice(fallback)
    }
  }

  function match(reg: RegExp | string) {
    const lookahead = current.match(reg)
    if (lookahead) {
      const token = lookahead[0]
      current = current.slice(token.length)
      index += token.length
      return token
    } else {
      throw new SyntaxError(`index: ${index}, ${current}`)
    }
  }

  return element()
}
