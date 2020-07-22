import IParseMailTemplateDTO from '../dtos/IParseMailTemplateDTO';
import IMailProvider from '../models/IMailTemplateProvider';

class FakeMailTemplateProvider implements IMailProvider {
  public async parse({ template }: IParseMailTemplateDTO): Promise<string> {
    return template;
  }
}

export default FakeMailTemplateProvider;
