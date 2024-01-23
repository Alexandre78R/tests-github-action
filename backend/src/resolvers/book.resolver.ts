import { Arg, Authorized, Int, Mutation, Query, Resolver } from "type-graphql";
import BookService from "../services/book.service";
import Book, { InputCreateBook } from "../entities/book.entity";

@Resolver()
export default class BookResolver {
  @Authorized()
  @Query(() => [Book])
  async books() {
    return await new BookService().listBooks();
  }

  @Query(() => Book)
  async findBook(@Arg("id") id: string) {
    return await new BookService().findBook(id);
  }

  @Query(() => Int)
  async test() {
    return 123
  }

  @Mutation(() => Book)
  async createBook(@Arg("infos") infos: InputCreateBook) {
    const newBook = await new BookService().createBook(infos);
    return newBook;
  }

  @Authorized(["ADMIN"])
  @Mutation(() => Book)
  async deleteBook(@Arg("id") id: string) {
    const bookDeleted = await new BookService().deleteBook(id);
    return bookDeleted;
  }
}
