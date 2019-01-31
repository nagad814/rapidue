/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, {Component} from 'react';
import {StyleSheet, Text, View, FlatList, Image, Dimensions} from 'react-native';
import {Container, Header, Title, Button, Body, Content, Item,Label,Input, Card, CardItem} from 'native-base';



class ImageCardItem extends Component {

  state = {
    imgHeight: 0,
  }

  componentDidMount() {

    Image.getSize(this.props.item.Poster, (width, height) => {
      // calculate image width and height 
      const screenWidth = Dimensions.get('window').width / 2
      const scaleFactor = width / screenWidth
      const imageHeight = height / scaleFactor
      this.setState({imgHeight: imageHeight})
    })
  }

  render() {

    const {imgHeight} = this.state

    return (

      <Card style={{width:'50%', height:imgHeight+60, flexDirection: 'column'}}>
      <CardItem cardBody>


        <Image
          style={{width: '100%', height: imgHeight, }}
          source={{uri: this.props.item.Poster}}
          resizeMode="contain"
        />

      </CardItem>
      <CardItem style={{flexDirection:'column'}}>
        <Text style={{fontWeight:'500', fontSize:14}}>{this.props.item.Title}</Text>
        <Text>{this.props.item.Year}</Text>
      </CardItem>
      </Card>


    )
  }
}

class ModalCard extends Component { 

  render(){
    return (
      <View></View>
    );
  }
}



type Props = {};
export default class App extends Component<Props> {
  state = {
    search: '',
    list: [],
  };
 
  _onSearch = search => {
    console.log(search);
    this.setState({search});
  }

  _apiCall = search => {
    console.log(search);


      fetch('http://www.omdbapi.com/?i=tt3896198&apikey=13fb07a4&s='+search)
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson)
          if(responseJson.Response){
            this.setState({list:responseJson.Search})
          }
        })
        .catch((error) => {
          console.error(error);
        });

    
  }

  _keyExtractor = (item) => item.imdbID;

  _onPressItem = (id: string) => {
    // updater functions are preferred for transactional updates
    this.setState((state) => {
      // copy the map rather than modifying state.
      const selected = new Map(state.selected);
      selected.set(id, !selected.get(id)); // toggle
      return {selected};
    });
  };

  _renderItem = ({item}) => (
 
        <ImageCardItem item={item}/>

  );

  render() {

    const { search } = this.state

    return (
      <Container>
        <Header>
        <Body>
            <Title>omdbSearchClient</Title>
          </Body>
        </Header>
        <Content padder>
          <View style={{flexDirection:"row"}}>
          <View style={{width:'80%'}}>
          <Item floatingLabel>
            <Label>Search by movie title</Label>
            <Input 
              onChangeText={this._onSearch}
              value={search}
            />
          </Item>
          </View>

          <Button light onPress={() => this._apiCall(search)}>
          <Text style={{padding:2, fontSize: 20, fontWeight:'400'}}> Search </Text>
          </Button>

          </View>

          <FlatList 
            data={this.state.list}
            keyExtractor={this._keyExtractor}
            renderItem={this._renderItem}
            numColumns={2}
          />

        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({

});
