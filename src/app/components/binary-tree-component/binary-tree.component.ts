import { OnInit, Component } from '@angular/core';
import { FileReaderService } from '../../services/FileReader.service';

export class Node {
  word;
  occurences;
  left;
  right;
  isUsed;
  constructor({
    word,
    occur,
    left,
    right,
    isUsed,
  }) {
    this.word = word;
    this.occurences = occur;
    this.left = left;
    this.right = right;
    this.isUsed = isUsed;
  }
}


@Component({
  selector: 'binary-tree-component',
  templateUrl: './binary-tree.component.html',
  styleUrls: ['./binary-tree.component.scss'],
})
export class BinaryTreeComponent implements OnInit {
  fileData;
  displayArr = [];
  constructor(public fileReaderService: FileReaderService) { }

  ngOnInit(): void {
    // read txt file content located in assets/input.txt
    this.fileReaderService.getTextFromFile().subscribe((data) => {
      this.fileData = data;
      this.createTree(data);
    });
  }

  // on text change of text area
  onTextChange(event): void {
    this.displayArr = [];
    if (event && event.target && Boolean(event.target.value.trim())) {
      this.fileData = event.target.value;
      this.createTree(this.fileData);
    }
  }

  createObjectOfUniqueWords(words): Object {
    // used object so as to avoid the looping
    const uniqueWordObj = {};
    words.forEach((item) => {
      if (uniqueWordObj[`${item}`]) {
        uniqueWordObj[`${item}`].occurences += 1;
      } else {
        uniqueWordObj[`${item}`] = new Node({
          word: item,
          occur: 1,
          left: null,
          right: null,
          isUsed: false,
        });
      }
    });
    return uniqueWordObj;
  }

  sortArrayByOccurences(arrayOfWordObjects): []  {
    return arrayOfWordObjects.sort((word1, word2) => word1.occurences > word2.occurences ? 1 : -1);
  }

  createParentNode(leftNode, rightNode) {
    leftNode.isUsed = true;
    rightNode.isUsed = true;
    return new Node({
      word: '',
      occur: leftNode.occurences + rightNode.occurences,
      left: leftNode,
      right: rightNode,
      isUsed: false,
    });
  }

  printNodes(node, spaceCount): void {
    if (node) {
      const count = spaceCount + 4;
      const whiteSpaceString = Array(count).join('-') + node.occurences;
      const formattedString = `${whiteSpaceString} ${node.right == null && node.left == null ? '('+node.word+')' : ''}`;
      this.displayArr = [...this.displayArr, formattedString];
      this.printNodes(node.left, count);
      this.printNodes(node.right, count)
    }
  }

  // creates nested object tree structure from given sorted array
  createUnbalencedBinaryTree(sortedArray): void {
    const arrayOfNodes = [...sortedArray];

    if (arrayOfNodes.length >= 2) {

      sortedArray.map((item, index) => {
        if (!item.isUsed) {
          const availableParentNodes = arrayOfNodes.filter((node) => (node.right !== null || node.left !== null) && !node.isUsed);

          switch (availableParentNodes.length) {
            case 0:
              if (sortedArray[index] && sortedArray[index + 1]) {
                arrayOfNodes.push(this.createParentNode(sortedArray[index], sortedArray[index + 1]));
              }
              break;
            case 1:
              if (availableParentNodes[0].right.word !== '' && availableParentNodes[0].left.word !== '') {
                if(sortedArray[index] && sortedArray[index + 1]) {
                  arrayOfNodes.push(this.createParentNode(sortedArray[index], sortedArray[index + 1]));
                } else {
                  arrayOfNodes.push(this.createParentNode(availableParentNodes[0], sortedArray[index] ));
                }
              } else {
                arrayOfNodes.push(this.createParentNode(availableParentNodes[0], sortedArray[index] ));
              }
              break;
            case 2:
              const paraentNode = this.createParentNode(availableParentNodes[0], availableParentNodes[1]);
              arrayOfNodes.push(paraentNode);
              arrayOfNodes.push(this.createParentNode(paraentNode, sortedArray[index]));
              break;
          }
        }
      });
    }
    this.printNodes(arrayOfNodes[arrayOfNodes.length - 1], 0);
  }

  // create tree from textArea/file input
  createTree(data): void {
    if (data) {
      const wordsArray = data.trim().split(/\s+/);
      const arrayOfUniqueString = Object.values(this.createObjectOfUniqueWords(wordsArray));
      this.createUnbalencedBinaryTree(this.sortArrayByOccurences(arrayOfUniqueString));
    } else {
      this.displayArr = [];
    }
  }
}
