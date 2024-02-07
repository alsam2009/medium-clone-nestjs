import { Injectable } from '@nestjs/common';
import { TagEntity } from './tags.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(TagEntity)
    private readonly tagRepository: Repository<TagEntity>,
  ) {}
  async findAll(): Promise<{ tags: string[] }> {
    const tags = await this.tagRepository.find();
    return {
      tags: tags.map((tag) => tag.name),
    };
  }

  // create(createTagDto: CreateTagDto) {
  //   return 'This action adds a new tag';
  // }
  // findOne(id: number) {
  //   return `This action returns a #${id} tag`;
  // }

  // update(id: number, updateTagDto: UpdateTagDto) {
  //   return `This action updates a #${id} tag`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} tag`;
  // }
}
