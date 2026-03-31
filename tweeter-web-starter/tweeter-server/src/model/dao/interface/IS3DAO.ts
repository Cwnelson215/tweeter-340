export interface IS3DAO {
  putImage(
    fileName: string,
    imageStringBase64Encoded: string
  ): Promise<string>;
}
