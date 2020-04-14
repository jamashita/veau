import { JSONA } from '../JSONA';
import { JSObjectNotation } from '../Value';
import { JSONAError } from '../JSONAError';

// DONE
describe('JSONA', () => {
  describe('parse', () => {
    it('outputs the same one as JSON.parse()', async () => {
      const str: string = '{"glossary":{"title":"example glossary","GlossDiv":{"title":"S","GlossList":{"GlossEntry":{"ID":"SGML","SortAs":"SGML","GlossTerm":"Standard Generalized Markup Language","Acronym":"SGML","Abbrev":"ISO 8879:1986","GlossDef":{"para":"A meta-markup language, used to create markup languages such as DocBook.","GlossSeeAlso":["GML","XML"]},"GlossSee":"markup"}}}}}';

      expect(await JSONA.parse<JSObjectNotation>(str)).toEqual(JSON.parse(str));
    });

    it('throws SyntaxError when the JSON is mal format, but the Error is wrapped', async () => {
      const str: string = '{"we":"you"';

      await expect(JSONA.parse<JSObjectNotation>(str)).rejects.toThrow(JSONAError);
    });
  });

  describe('stringify', () => {
    it('outputs the same object as JSON.stringify()', async () => {
      const obj: JSObjectNotation = {
        glossary: {
          title: 'example glossary',
          GlossDiv: {
            title: 'S',
            GlossList: {
              GlossEntry: {
                ID: 'SGML',
                SortAs: 'SGML',
                GlossTerm: 'Standard Generalized Markup Language',
                Acronym: 'SGML',
                Abbrev: 'ISO 8879:1986',
                GlossDef: {
                  para: 'A meta-markup language, used to create markup languages such as DocBook.',
                  GlossSeeAlso: [
                    'GML',
                    'XML'
                  ]
                },
                GlossSee: 'markup'
              }
            }
          }
        }
      };

      expect(await JSONA.stringify(obj)).toEqual(JSON.stringify(obj));
    });

    it('throws TypeError when the JSON has circular reference, but the Error is wrapped', async () => {
      const obj1: any = {};
      const obj2: any = {
        obj1
      };
      obj1.obj2 = obj2;

      await expect(JSONA.stringify(obj1)).rejects.toThrow(JSONAError);
    });
  });
});
