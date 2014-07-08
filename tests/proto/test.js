/**
 *  Created by Sebastien Couture on 2013-12-21.
 *  Copyright (c) 2013 Sebastien Couture. All rights reserved.
 *
 *  Permission is hereby granted, free of charge, to any person
 *  obtaining a copy of this software and associated documentation
 *  files (the "Software"), to deal in the Software without
 *  restriction, including without limitation the rights to use,
 *  copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the
 *  Software is furnished to do so, subject to the following
 *  conditions:
 *
 *  The above copyright notice and this permission notice shall be
 *  included in all copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 *  EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 *  OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 *  NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 *  HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 *  WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 *  FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 *  OTHER DEALINGS IN THE SOFTWARE.
 */

(function()
{
    var Product = Recurve.Proto.define(
    [
        // Constructor. Name doesn't matter. Constructor is optional
        function ctor( title, price )
        {
            this.title = title;
            this.price = price;
        },

        // prototype/"member" variables/functions
        {
            title: null,
            price: 0,

            isValid: function()
            {
                return this.title && 0 < this.title.length &&
                    0 < this.price;
            },

            toString: function()
            {
                return "title: " + this.title +  ", price: " + this.price;
            }
        }
    ]);

    var Book = Product.extend(
    [
        // Constructor. Name doesn't matter. Constructor is optional
        function ctor( title, price, author )
        {
            this._super( title, price );

            this.author = author;
        },

        // prototype/"member" variables/functions
        {
            author: null,

            isValid: function()
            {
                return this._super() &&
                    this.author && 0 < this.author.length;
            },

            toString: function()
            {
                return this._super() + ", author: " + this.author;
            }
        },

        // namespaced/"static" variables/functions
        {
            typeId: function()
            {
                return "123456789";
            }
        }
    ]);

    // Example with no constructor, Product constructor will be called
    var Video = Product.extend(
    [
        {
            lengthSec: 0
        }
    ]);

    var EventMixin =
    {
        addEventListener: function()
        {
            console.log( "called addEventListener()" );
        },

        removeEventListener: function()
        {
            console.log( "called removeEventListener()" );
        }
    };

    Product.mixin( EventMixin );

    console.log( Book.typeId() );

    var prod = new Product( "HB1 Pencil", 0.1 );
    var book = new Book( "Code Complete", "31.50", "Steve McConnell" );
    var video = new Video( "Into the Wild", 19.99 );

    console.log( prod.toString() );
    console.log( book.toString() );
    console.log( video.toString() );

    console.log( "pencil product valid? " + prod.isValid() );
    console.log( "book product valid? " + book.isValid() );
    console.log( "video product valid? " + video.isValid() );

    console.log( "book instanceof Book? " + ( book instanceof Book ) );
    console.log( "video instanceof Video? " + ( video instanceof Video ) );

    book.addEventListener();
    book.removeEventListener();
})();