import React from 'react';
import CollectionOverview from '../../components/collections-overview/collections-overview';
import { Route } from 'react-router-dom';
import CollectionPage from '../collection/collection';
import { firestore, convertCollectionsSnapshotToMap } from '../../firebase/firebase.utils';
import { connect } from 'react-redux';
import { updateCollections } from '../../redux/shop/shop.actions';
import { withSpinner } from '../../components/with-spinner/with-spinner';

const CollectionOverviewWithSpinner = withSpinner(CollectionOverview);
const CollectionPageWithSpinner = withSpinner(CollectionPage);

// if /shop -> render CollectionOverview
// if /shop/... -> render CollectionPage
class ShopPage extends React.Component {
    state = {
        loading: true
    };

    unsubscribeFromSnapshot = null;
// ShopPage component rendered -> download data from firebase, set data into redux store
    componentDidMount(){
        const { updateCollections } = this.props;
        const collectionRef = firestore.collection('collections');

    collectionRef.get().then(snapshot =>{
        const collectionsMap = convertCollectionsSnapshotToMap(snapshot);
        updateCollections(collectionsMap);
        this.setState({loading:false});
        });
    }

    render(){
        const { match } = this.props;
        const { loading } = this.state;
        return (
            <div className='shop-page'>
                <Route exact path={`${match.path}`} render={(props)=> <CollectionOverviewWithSpinner isLoading={loading}{...props}/>} />
                <Route path={`${match.path}/:collectionId`} render={(props)=> <CollectionPageWithSpinner isLoading={loading}{...props}/>}  />
            </div>
            );
        }
    }   

const mapDispatchToProps = dispatch => ({
    updateCollections: collectionsMap =>
        dispatch(updateCollections(collectionsMap))
});

export default connect(null,mapDispatchToProps)(ShopPage);