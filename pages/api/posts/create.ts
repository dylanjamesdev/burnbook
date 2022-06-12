'use strict';

import dbConnectionInit from '../../../libs/database/dbConnection';
import postModel from '../../../libs/database/models/posts';

export default async function newPostAPI(req, res) {
    // Check if post request
    if (req.method === 'POST') {
        // Init db
        dbConnectionInit();

        // Data for db
        let id = Math.floor(Math.random() * 1000000000000);
        let title = req.body.title;
        let content = req.body.content;
        let delete_keyword = req.body.delete_keyword;

        // If no post content, return error on backend
        if (!content || !delete_keyword) {
            return res.status(400).json({
                error: true,
                code: 400,
                message: 'Missing required field to create post.',
            });
        }

        // Create & save db entry
        new postModel({
            _id: id,
            title: title || 'Annonymous',
            content: content,
            delete_keyword: delete_keyword,
            deleted: false,
            deletedAt: null,
            reported: false,
            reportedAt: null,
            postedAt: new Date().toDateString(),
        })
            .save()
            .catch((err) => {
                return res.status(500).json({
                    error: true,
                    code: 500,
                    message: '[Internal Error] Database save failure',
                    stacktrace: err,
                });
            })
            .then((post) => {
                console.log(`Added a record to the database.`, post);
                return res
                    .status(200)
                    .json({ error: false, status: 200, message: 'Post created successfully.', data: post });
            });
    } else {
        // Handle other requests
        return res.status(405).json({
            error: true,
            code: 405,
            message: 'Method not allowed',
        });
    }
}
