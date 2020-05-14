import {MongoInternals} from 'meteor/mongo';

/**
 * Utility async function to wrap async raw mongo operations with a transaction
 * @param asyncRawMongoOperations
 * @returns {Promise<*>}
 */
const runTransactionAsync = async asyncRawMongoOperations => {

    // setup a transaction
    const { client } = MongoInternals.defaultRemoteCollectionDriver().mongo;
    const session = await client.startSession();
    await session.startTransaction();
    try {
        // running the async operations
        const result = await asyncRawMongoOperations(session);
        await session.commitTransaction();
        // transaction committed - return value to the client
        return result;
    } catch (err) {
        await session.abortTransaction();
        console.error(err.message);
        // transaction aborted - report error to the client
        throw new Meteor.Error('Database Transaction Failed', err.message);
    } finally {
        session.endSession();
    }
};

export default {runTransactionAsync};
